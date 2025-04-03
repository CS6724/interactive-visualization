from typing import Literal, Any
from pydantic import BaseModel, Field

from langchain_community.utilities import SQLDatabase
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain_groq import ChatGroq
from langchain_ollama import ChatOllama
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import ToolMessage, AIMessage, HumanMessage
from langchain_core.runnables import RunnableLambda, RunnableWithFallbacks,RunnableMap
from langgraph.graph import END, START, StateGraph
from langgraph.prebuilt import ToolNode
from data_models import UMLClassDiagram
from common import State
from dotenv import load_dotenv
load_dotenv()

# Setup DB and LLM
model_name = "deepseek-r1-distill-llama-70b"
llm = ChatGroq(model=model_name)
db = SQLDatabase.from_uri("sqlite:///uml-data.db")
toolkit = SQLDatabaseToolkit(db=db, llm=llm)
tools = toolkit.get_tools()

list_tables_tool = next(tool for tool in tools if tool.name == "sql_db_list_tables")
get_schema_tool = next(tool for tool in tools if tool.name == "sql_db_schema")

from pydantic import BaseModel, Field

class SubmitFinalAnswer(BaseModel):
    """Submit the final answer to the user based on the query results."""

    final_answer: str = Field(..., description="The final answer to the user based on the UML class diagram and query.")

@tool
def db_query_tool(query: str) -> str:
    """
    Execute a SQL query against the database and get back the result.
    If the query is not correct, an error message will be returned.
    """
    result = db.run_no_throw(query)
    if not result:
        return "Error: Query failed. Please rewrite your query and try again."
    return result

def handle_tool_error(state: State) -> dict:
    error = state.get("error")
    tool_calls = state["source_query"][-1].tool_calls
    return {
        "db_response": [
            ToolMessage(
                content=f"Error: {repr(error)}\nPlease fix your mistakes.",
                tool_call_id=tc["id"]
            ) for tc in tool_calls
        ]
    }

def create_tool_node_with_fallback(tools: list) -> RunnableWithFallbacks[Any, dict]:
    return ToolNode(tools).with_fallbacks(
        [RunnableLambda(handle_tool_error)], exception_key="error"
    )

query_gen_system = """You are a SQL expert helping users explore a database that represents a software system's architecture extracted from source code and currently visualized as a UML class diagram.

The database schema includes tables such as `uml_class`, `uml_property`, `uml_method`, and `uml_relationship`.

- Each `uml_class` represents a class from the source code, with metadata such as `id`, `name`, `package`, `isAbstract`, and `isInterface`.
- The `uml_property` table stores the attributes/fields of each class, including `dataType`, `visibility`, and `isStatic`.
- The `uml_method` table stores methods/functions of each class, including `returnType`, `parameters`, `visibility`, and whether the method is static or abstract.
- The `uml_relationship` table stores the relationships between classes, such as inheritance, association, composition, or method-level dependencies.

You are helping users ask questions about what they are currently seeing in the UML diagram — the visible portion of the software architecture — such as:
- Which classes were edited recently?
- Which class has the most methods?
- Which classes are abstract interfaces?
- What are the components of a specific package?
- Which classes are related by composition or inheritance?

You must generate accurate and minimal **SQLite** queries that retrieve the correct information based on the user's question and the visible UML diagram.

Only respond with the **final answer**, not the SQL query.
Only use data available in the current UML context (i.e., user input and visible diagram).
DO NOT call any tool besides SubmitFinalAnswer to submit the final answer.
"""

query_gen_prompt = ChatPromptTemplate.from_messages([
    ("system", query_gen_system),
    ("human", "Visible UML diagram: {uml_json}"),
    MessagesPlaceholder(variable_name="source_query")
])

query_gen = (
    RunnableMap({
        "uml_json": lambda state: state["original_diagram"],
        "source_query": lambda state: state["source_query"]
    })
    | query_gen_prompt
    | llm.bind_tools([SubmitFinalAnswer])
)
def query_gen_node(state: State):
    message = query_gen.invoke(state)
    tool_messages = []
    if message.tool_calls:
        for tc in message.tool_calls:
            if tc["name"] != "SubmitFinalAnswer":
                tool_messages.append(
                    ToolMessage(
                        content=f"Error: The wrong tool was called: {tc['name']}. Please fix your mistakes.",
                        tool_call_id=tc["id"]
                    )
                )
            else:
                final_answer = tc["args"]["final_answer"]
                state["db_response"] = [AIMessage(content=final_answer)]
    return {"db_response": [message] + tool_messages}

def should_continue(state: State) -> Literal["final", "correct_query", "query_gen"]:
    messages = state["db_response"]
    last_message = messages[-1]
    if getattr(last_message, "tool_calls", None):
        return "final"
    if last_message.content.startswith("Error:"):
        return "query_gen"
    else:
        return "correct_query"

def prep_response(state: State)-> State:
    for tc in state["db_response"][-1].tool_calls:
        if tc["name"] == "SubmitFinalAnswer":
            state["source_response"] = tc["args"]["final_answer"]
            break
    print("Prep Response: " + state["source_response"])
    return state
def create_code_subgraph():
    workflow = StateGraph(State)
    workflow.add_node("query_gen", query_gen_node)
    workflow.add_node("final", prep_response)
    workflow.add_node("correct_query", lambda state: {"db_response": [query_gen.invoke(state)]})
    workflow.add_node("execute_query", create_tool_node_with_fallback([db_query_tool]))
    workflow.set_entry_point("query_gen")
    workflow.add_conditional_edges("query_gen", should_continue)
    workflow.add_edge("correct_query", "execute_query")
    workflow.add_edge("execute_query", "query_gen")
    workflow.add_edge("final", END)
    return workflow.compile()

if __name__ == "__main__":
    from sample_data import keycloak_data
    g = create_code_subgraph()

    result = g.invoke({
        "source_query": [HumanMessage(content="Which classes are interfaces?")],
        "original_diagram": keycloak_data
    })
    print(result["source_response"])