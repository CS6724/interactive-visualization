from langchain_core.messages import BaseMessage, AIMessage
from langchain_core.runnables import RunnableLambda
from shared import State, get_prompts
from helpers import get_agent, clean_string
AGENT_KEY = "response_chat"
llm = get_agent(AGENT_KEY)
prompt = get_prompts(AGENT_KEY)

def ensure_list(value):
    if isinstance(value, list):
        return [clean_string(l.content) for l in value]
    elif isinstance(value, str):
        return [BaseMessage(content=clean_string(value))]
    elif isinstance(value, BaseMessage):
        return [BaseMessage(content=clean_string(value.content))]
    else:
        return []

def response_chat_node(state: State) -> State:

    input_data = {
        "user_query": ensure_list(state.get("user_query", [])),
        "source_response": ensure_list(state.get("source_response", [])),
        "git_response": ensure_list(state.get("git_response", [])),
        "github_response": ensure_list(state.get("github_response", [])),
        "docs_response": ensure_list(state.get("docs_response", [])),
        "context": ensure_list(state.get("context", [])),
    }
    chain = prompt | llm #| RunnableLambda(lambda msg: msg.content if hasattr(msg, "content") else str(msg))
    result = chain.invoke(input_data)

    state["chat_reply"] = AIMessage(content=result.content)
    return state