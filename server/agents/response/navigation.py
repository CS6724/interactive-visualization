from shared import State
def response_navigation_node(state: State) -> State:
    """An LLM-based router."""
    state["navigation_response"] = "Navigation Response Added"
    return state
