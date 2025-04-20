from langgraph.graph import StateGraph,  START, END
from langchain_core.messages import AIMessage, HumanMessage
from shared import State, UMLClassDiagram
from .chat import response_chat_node
from .diagram import response_diagram_node
from .navigation import response_navigation_node
from .supervisor import response_supervisor_node

def create_response_subgraph():
    workflow = StateGraph(State)
    workflow.add_node("response_supervisor", response_supervisor_node)
    workflow.add_node("navigation_response", response_navigation_node)
    workflow.add_node("diagram_response", response_diagram_node)
    workflow.add_node("chat_response", response_chat_node)
    
    workflow.add_edge(START, "response_supervisor")
    workflow.add_edge("response_supervisor", "navigation_response")
    workflow.add_edge("response_supervisor", "diagram_response")
    workflow.add_edge("response_supervisor", "chat_response")
    workflow.add_edge(["navigation_response","diagram_response", "chat_response"], END)

    return workflow.compile()