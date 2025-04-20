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
        json_str = text[text.index("{"):]
        return json.loads(json_str)
    except Exception as e:
        print("LLM response could not be parsed:", e)
        return {
            "chat_response": False,
            "diagram_response": False,
            "navigation_response": False
        }

def response_supervisor_node(state: State) -> State:
    chain = prompt | llm | RunnableLambda(lambda msg: msg.content if isinstance(msg, BaseMessage) else msg)
    result = chain.invoke({
        "user_query": state["user_query"],
        "source_response": [state["source_response"]],
        "git_response": [state["git_response"]],
        "github_response": [state["github_response"]],
        "docs_response": [state["docs_response"]],
        "context": [],
    })

    parsed = safe_parse_json(result)

    state["should_run_chat"] = parsed.get("chat_response", False)
    state["should_run_diagram"] = parsed.get("diagram_response", False)
    state["should_run_navigation"] = parsed.get("navigation_response", False)

    # if not (state["should_run_chat"] or state["should_run_diagram"] or state["should_run_navigation"]):
    #     state["chat_reply"] = HumanMessage(
    #         content=f"I'm sorry, I can't answer the following question based on the tools and information available:\n\n❓ {state['user_query'][-1].content}"
    #     )

    return state