from langgraph.graph import StateGraph,  START, END
from shared import State
from .supervisor import information_supervisor_node
from .source_code import information_source_code_node
from .git import information_git_node
from .github import information_github_node
from .docs import information_docs_node

def create_information_subgraph():
    workflow = StateGraph(State)
    workflow.add_node("information_supervisor", information_supervisor_node)
    workflow.add_node("information_source_code", information_source_code_node)
    workflow.add_node("information_git", information_git_node)
    workflow.add_node("information_github", information_github_node)
    workflow.add_node("information_docs", information_docs_node)
    
    workflow.add_edge(START, "information_supervisor")
    workflow.add_edge("information_supervisor", "information_source_code")
    workflow.add_edge("information_supervisor", "information_git")
    workflow.add_edge("information_supervisor", "information_github")
    workflow.add_edge("information_supervisor", "information_docs")
    workflow.add_edge(["information_supervisor","information_source_code", "information_git", "information_github", "information_docs"], END)

    return workflow.compile()

