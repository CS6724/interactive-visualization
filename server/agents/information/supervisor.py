import re
import json

from langgraph.graph import StateGraph,  START, END
from langchain_core.messages import BaseMessage
from langchain_core.runnables import RunnableLambda
from shared import State, get_prompts
from helpers import get_agent
AGENT_KEY = "information_supervisor"

llm = get_agent(AGENT_KEY)
prompt = get_prompts(AGENT_KEY)

def safe_parse_json(text: str):
    try:
        # Remove everything before first {
        json_str = text[text.index("{"):]
        return json.loads(json_str)
    except Exception as e:
        print("LLM response could not be parsed:", e)
        return {
            "source_code": "PASS",
            "git": "PASS",
            "github": "PASS",
            "docs": "PASS"
        }
    
def information_supervisor_node(state: State) -> State:
    """
    Generates targeted subqueries for each information source based on the user's input.

    This node uses an LLM to analyze the user's original query and determine the relevance
    of each information source: source_code, git, github, and docs. For each source, it generates 
    a refined subquery tailored to that source's capabilities. If a source is deemed irrelevant 
    for the current query, it assigns the string "PASS" to signal downstream nodes to skip processing.

    Updates the following fields in the state:
    - state["source_query"]: subquery for source_code node or "PASS"
    - state["git_query"]: subquery for git node or "PASS"
    - state["github_query"]: subquery for github node or "PASS"
    - state["docs_query"]: subquery for docs node or "PASS"

    Parameters:
        state (State): The current execution state containing the user's query.

    Returns:
        State: The updated state with subqueries for each information source.
    """

    chain = prompt | llm | RunnableLambda(lambda msg: msg.content if isinstance(msg, BaseMessage) else msg)

    result = chain.invoke({"user_query": state["user_query"]})
    parsed = safe_parse_json(result) if isinstance(result, str) else result
    state["source_query"] = parsed.get("source_code", "PASS")
    state["git_query"] = parsed.get("git", "PASS")
    state["github_query"] = parsed.get("github", "PASS")
    state["docs_query"] = parsed.get("docs", "PASS")    
    return state