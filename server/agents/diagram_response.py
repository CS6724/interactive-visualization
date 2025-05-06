# from langchain_core.messages import BaseMessage, AIMessage
# from langchain_core.runnables import RunnableLambda
# from shared import State, get_prompts
# from helpers import get_agent, clean_string
# from typing import List
# from dotenv import load_dotenv
# from langchain_core.prompts import ChatPromptTemplate
# from langchain_groq import ChatGroq
# from langchain.prompts import MessagesPlaceholder
# from langchain.schema import SystemMessage, HumanMessage
# from shared import UMLClassDiagram, State, system_prompts, user_prompts
# from langchain.output_parsers import PydanticOutputParser


# AGENT_KEY = "diagram_painter"
# llm = get_agent(AGENT_KEY)
# prompt = get_prompts(AGENT_KEY)

# def ensure_list(value):
#     if isinstance(value, list):
#         return [clean_string(l.content) for l in value]
#     elif isinstance(value, str):
#         return [BaseMessage(content=clean_string(value))]
#     elif isinstance(value, BaseMessage):
#         return [BaseMessage(content=clean_string(value.content))]
#     else:
#         return []

# def diagram_response_node(state: State) -> State:
#         """An LLM-based diagram updater"""
#         original_diagram = state.get("original_diagram", None)
#         if original_diagram:
#             original_diagram = original_diagram[-1].to_json()
#         input_data = {
#             "user_query": ensure_list(state.get("user_query", [])),
#             "original_diagram": [original_diagram],
#             "source_response": ensure_list(state.get("source_response", [])),
#             "git_response": ensure_list(state.get("git_response", [])),
#             "github_response": ensure_list(state.get("github_response", [])),
#             "docs_response": ensure_list(state.get("docs_response", [])),
#             "context": ensure_list(state.get("context", [])),
#         }
#         parser = PydanticOutputParser(pydantic_object=UMLClassDiagram)
#         chain = prompt | llm | parser 
#         result = chain.invoke(input_data)

#         state["updated_diagram"] = AIMessage(content=result.content)
#         return state
