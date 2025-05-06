from typing import Annotated, List, Optional, Set, TypedDict
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage
from langgraph.graph.message import add_messages
from .data_models import UMLClassDiagram

def identity(a, b):
    return b

class State(TypedDict):
    # User input
    user_query: Annotated[list[HumanMessage], add_messages]

    # Project config
    project_name: Annotated[Optional[HumanMessage], identity]
    source_db: Annotated[Optional[HumanMessage], identity]
    repository_path: Annotated[Optional[HumanMessage], identity]
    github_url: Annotated[Optional[HumanMessage], identity]
    docs_source: Annotated[Optional[HumanMessage], identity]
    original_diagram: Annotated[Optional[UMLClassDiagram], identity]
    context: Annotated[Optional[list[HumanMessage]], add_messages]
    history:  Annotated[Optional[HumanMessage], add_messages]

    # Agent input queries
    source_query: Annotated[list[HumanMessage], add_messages]
    git_query: Annotated[list[HumanMessage], add_messages]
    github_query: Annotated[list[HumanMessage], add_messages]
    docs_query: Annotated[list[HumanMessage], add_messages]

    # Agent outputs
    supervisor_response: Annotated[Optional[list[BaseMessage]], add_messages]
    source_response: Annotated[Optional[list[BaseMessage]], add_messages]
    git_response: Annotated[Optional[list[BaseMessage]], add_messages]
    github_response: Annotated[Optional[list[BaseMessage]], add_messages]
    docs_response: Annotated[Optional[list[BaseMessage]], add_messages]

    # Flags
    should_run_chat: Annotated[bool, identity]
    should_run_diagram: Annotated[bool, identity]
    should_run_navigation: Annotated[bool, identity]

    # Final output
    chat_reply: Annotated[Optional[HumanMessage], identity]
    navigation_reply: Annotated[Optional[HumanMessage], identity]
    diagram_reply: Annotated[Optional[UMLClassDiagram], identity]

    # 🔁 For iterative information calls
    information_round: Annotated[int, identity]                # e.g. 0 → 3
    information_done: Annotated[Set[str], identity]            # e.g. {"source_code", "git"}