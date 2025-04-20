from shared import State
def response_diagram_node(state: State) -> State:
    """An LLM-based router."""
    state["diagram_response"] = "Diagram Response Added"
    return state

