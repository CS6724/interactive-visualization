# # pip install langchain  langgraph langchain_core langchain_experimental langchain_openai
# from langgraph.graph import StateGraph,  START, END
# from langchain_core.messages import AIMessage, HumanMessage
# # from langchain_ollama import ChatOllama
# from langgraph.graph.message import add_messages

# from agents import create_code_subgraph, diagram_response_node
# from shared import State, UMLClassDiagram

# def source_code_node(state: State) -> State:
#         """An LLM-based router."""
#         state["source_response"] = AIMessage(""" IMessageReader, IMessageWriter""")
#         return state

# def history_node(state: State) -> State:
#         """An LLM-based router."""
#         print("History Added")
#         state["history_response"] = ""
#         return state

# def docs_node(state: State) -> State:
#         """An LLM-based router."""
#         print("Docs Added")
#         state["docs_response"] = ""
#         return state

# def info_node(state: State) -> State:
#         """An LLM-based router."""
#         state["info_messages"] = "Infomration Supervisor Added"
#         return state

# def supervisor_node(state: State) -> State:
#         """An LLM-based router."""
#         state["source_query"] = state["user_query"]
#         return state

# def response_node(state: State) -> State:
#         """An LLM-based router."""
#         state["final_response"] = "Final Reponse Added"
#         return state

# def create_information_subgraph():
#     workflow = StateGraph(State)
#     workflow.add_node("information_supervisor", info_node)

#     workflow.add_node("source", source_code_node)
#     # workflow.add_node("history", history_node)
#     # workflow.add_node("docs", docs_node)
    
    
#     workflow.add_edge(START,"information_supervisor")
#     workflow.add_edge( "information_supervisor","source")
    

#     # workflow.add_edge( "information_supervisor","history")
#     # workflow.add_edge( "information_supervisor","docs")

#     # Return paths from each information node back to supervisor
#     workflow.add_edge("source", END)
#     # workflow.add_edge("history", END)
#     # workflow.add_edge("docs", END)
    

#     return workflow.compile()


# def create_response_subgraph():
#     workflow = StateGraph(State)
#     workflow.add_node("response_supervisor", response_supervisor_node)
#     workflow.add_node("navigation_response", navigation_response_node)
#     workflow.add_node("chat_response", chat_response_node)
#     workflow.add_node("diagram_response", diagram_response_node)
    
#     workflow.add_edge(START, "response_supervisor")
#     workflow.add_edge("response_supervisor", ["navigation_response","diagram_response", "chat_response"])
#     workflow.add_edge(["navigation_response","diagram_response", "chat_response"], END)

#     return workflow.compile()


# workflow = StateGraph(State)
# workflow.add_node("supervisor", supervisor_node)
# workflow.add_node("response", response_node)
# workflow.add_node("information", create_code_subgraph())
# workflow.add_node("diagram_response", diagram_response_node)
# # workflow.add_node("planner", planner_node)

# workflow.add_edge("supervisor", "information")
# workflow.add_edge("information", "response")
# workflow.add_edge("information", "diagram_response")
# workflow.add_edge("response", END)
# workflow.add_edge(START,"supervisor")

# graph = workflow.compile()

# if __name__ == "__main__":
#         from sample_data import keycloak_data
#         print(graph.invoke({
#                 "original_diagram": keycloak_data,
#                 "user_query": [HumanMessage("Which classes are interfaces?")]
#                 })["updated_diagram"])
#         # graph.get_graph().draw_mermaid_png(output_file_path="image.png")
