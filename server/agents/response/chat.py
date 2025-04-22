from langchain_core.messages import BaseMessage, AIMessage
from langchain_core.runnables import RunnableLambda
from shared import State, get_prompts
from helpers import get_agent

AGENT_KEY = "response_chat"
llm = get_agent(AGENT_KEY)
prompt = get_prompts(AGENT_KEY)

def get_latest_content(field):
    if isinstance(field, list):
        return field[-1].content if field else ""
    elif hasattr(field, "content"):
        return field.content
    return ""

def response_chat_node(state: State) -> State:
    if not state.get("should_run_chat"):
        state["chat_reply"] = AIMessage("")
        return state  # Skip if chat shouldn't be generated

    # Create the input for the prompt
    chain_input = {
        "user_query": state["user_query"],
        "source_response": state.get("source_response",[]),
        "git_response": state.get("git_response",[]),
        "github_response": state.get("github_response",[]),
        "docs_response": state.get("docs_response",[]),
        "context": [],
    }
    # Run the prompt → LLM → output chain
    chain = prompt | llm | RunnableLambda(lambda msg: msg.content if isinstance(msg, BaseMessage) else msg)
    result = chain.invoke(chain_input)
    # Store result in state
    state["chat_reply"] = AIMessage(content=result)
    return state