import json
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from langchain_core.runnables import RunnableLambda
from shared import State, get_prompts
from helpers import get_agent

AGENT_KEY = "response_supervisor"
llm = get_agent(AGENT_KEY)
prompt = get_prompts(AGENT_KEY)

def safe_parse_json(text: str):
    try:
        if not text or "{" not in text:
            raise ValueError("No JSON object found.")
        json_str = text[text.index("{"):]
        return json.loads(json_str)
    except Exception as e:
        return {
            "diagram_response": False,
            "navigation_response": False
        }
def ensure_list(value):
    # Ensure all values are lists of BaseMessages
    if isinstance(value, list):
        return value
    elif isinstance(value, str):
        return [HumanMessage(content=value)]
    elif isinstance(value, BaseMessage):
        return [value]
    else:
        return []

def response_supervisor_node(state: State) -> State:
    input_data = {
        "user_query": ensure_list(state.get("user_query", [])),
        "source_response": ensure_list(state.get("source_response", [])),
        "git_response": ensure_list(state.get("git_response", [])),
        "github_response": ensure_list(state.get("github_response", [])),
        "docs_response": ensure_list(state.get("docs_response", [])),
        "context": ensure_list(state.get("context", [])),
    }

    # This chain already includes prompt -> LLM -> extract .content
    chain = prompt | llm | RunnableLambda(lambda msg: msg.content if isinstance(msg, BaseMessage) else msg)
    result = chain.invoke(input_data)
    parsed = safe_parse_json(result)

    state["should_run_diagram"] = parsed.get("diagram_response", False)
    state["should_run_navigation"] = parsed.get("navigation_response", False)
    return state