from typing import Annotated, List, Optional, TypedDict
from langgraph.graph import StateGraph, MessagesState, START, END
from langchain.schema import SystemMessage, HumanMessage
from langgraph.graph.message import add_messages
from typing import Annotated, List, Optional, TypedDict
from langgraph.graph import StateGraph, MessagesState, START, END
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage
from .data_models import UMLClassDiagram
def identity(a, b):
    return b
class State(TypedDict):
    # User input
    user_query: Annotated[list[HumanMessage], add_messages]
    
    # Project config
    source_db: Annotated[Optional[HumanMessage], identity]
    repository_path: Annotated[Optional[HumanMessage], identity]
    github_url: Annotated[Optional[HumanMessage], identity]
    docs_source: Annotated[Optional[HumanMessage], identity]
    docs_source_type: Annotated[Optional[HumanMessage], identity]
    original_diagram: Annotated[Optional[UMLClassDiagram], identity]
    
    # Infomation nodes modified queries
    source_query: Annotated[list[HumanMessage], add_messages]
    git_query: Annotated[list[HumanMessage], add_messages]
    github_query: Annotated[list[HumanMessage], add_messages]
    docs_query: Annotated[list[HumanMessage], add_messages]
    
    # Optional fields with default values
    supervisor_response: Annotated[Optional[list[BaseMessage]], add_messages]
    
    # db_response: Annotated[Optional[list[BaseMessage]], add_messages]
    source_response: Annotated[Optional[list[BaseMessage]], add_messages]
    git_response: Annotated[Optional[list[BaseMessage]], add_messages]
    github_response: Annotated[Optional[list[BaseMessage]], add_messages]
    docs_response: Annotated[Optional[list[BaseMessage]], add_messages]
    

    should_run_chat: Annotated[bool, identity]
    should_run_diagram: Annotated[bool, identity]
    should_run_navigation: Annotated[bool, identity]
                                 
    chat_reply: Annotated[Optional[HumanMessage], identity]
    navigation_reply: Annotated[Optional[HumanMessage], identity]
    diagram_reply: Annotated[Optional[UMLClassDiagram], identity]