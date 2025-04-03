# pip install langchain  langgraph langchain_core langchain_experimental langchain_openai
import json
from typing import Annotated, List, Optional, TypedDict
from langgraph.graph import StateGraph, MessagesState, START, END
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage
# from langchain_ollama import ChatOllama
from langgraph.graph.message import add_messages
from response import diagram_response_node
from common import State
from data_models import UMLClassDiagram
from sample_data import original_diagram, keycloak_data
from information import create_code_subgraph

def source_code_node(state: State) -> State:
        """An LLM-based router."""
        state["source_response"] = AIMessage(""" IMessageReader, IMessageWriter""")
        return state

def history_node(state: State) -> State:
        """An LLM-based router."""
        print("History Added")
        state["history_response"] = ""
        return state

def docs_node(state: State) -> State:
        """An LLM-based router."""
        print("Docs Added")
        state["docs_response"] = ""
        return state

def info_node(state: State) -> State:
        """An LLM-based router."""
        state["info_messages"] = "Infomration Supervisor Added"
        return state


def supervisor_node(state: State) -> State:
        """An LLM-based router."""
        state["source_query"] = state["user_query"]
        return state

def response_node(state: State) -> State:
        """An LLM-based router."""
        state["final_response"] = "Final Reponse Added"
        return state

def create_information_subgraph():
    workflow = StateGraph(State)
    workflow.add_node("information_supervisor", info_node)

    workflow.add_node("source", source_code_node)
    # workflow.add_node("history", history_node)
    # workflow.add_node("docs", docs_node)
    
    
    workflow.add_edge(START,"information_supervisor")
    workflow.add_edge( "information_supervisor","source")
    

    # workflow.add_edge( "information_supervisor","history")
    # workflow.add_edge( "information_supervisor","docs")

    # Return paths from each information node back to supervisor
    workflow.add_edge("source", END)
    # workflow.add_edge("history", END)
    # workflow.add_edge("docs", END)
    

    return workflow.compile()


workflow = StateGraph(State)
workflow.add_node("supervisor", supervisor_node)
workflow.add_node("response", response_node)
workflow.add_node("information", create_code_subgraph())
workflow.add_node("diagram_response", diagram_response_node)
# workflow.add_node("planner", planner_node)

workflow.add_edge("supervisor", "information")
workflow.add_edge("information", "response")
workflow.add_edge("information", "diagram_response")
workflow.add_edge("response", END)
workflow.add_edge(START,"supervisor")

graph = workflow.compile()

if __name__ == "__main__":
        print(graph.invoke({
             "original_diagram": keycloak_data,
            "user_query": [HumanMessage("Which classes are interfaces?")]
            })["updated_diagram"])
        # graph.get_graph().draw_mermaid_png(output_file_path="image.png")
