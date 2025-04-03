from typing import Annotated, List, Optional, TypedDict
from langgraph.graph import StateGraph, MessagesState, START, END
from langchain.schema import SystemMessage, HumanMessage
from langgraph.graph.message import add_messages
from typing import Annotated, List, Optional, TypedDict
from langgraph.graph import StateGraph, MessagesState, START, END
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage
from data_models import UMLClassDiagram
def identity(a, b):
    return b
class State(TypedDict):
    user_query: Annotated[list[HumanMessage], add_messages]

    source_query: Annotated[list[HumanMessage], add_messages]
    history_query: Annotated[list[HumanMessage], add_messages]
    docs_query: Annotated[list[HumanMessage], add_messages]
    
    # Optional fields with default values
    supervisor_response: Annotated[Optional[list[BaseMessage]], add_messages]
    
    db_response: Annotated[Optional[list[BaseMessage]], add_messages]
    source_response: Annotated[Optional[list[BaseMessage]], add_messages]
    history_response: Annotated[Optional[list[BaseMessage]], add_messages]
    docs_response: Annotated[Optional[list[BaseMessage]], add_messages]
    
    final_response: Annotated[Optional[list[BaseMessage]], add_messages]
    info_messages: Annotated[Optional[list[BaseMessage]], add_messages]

    original_diagram: Annotated[Optional[UMLClassDiagram], identity]
    updated_diagram: Annotated[Optional[UMLClassDiagram], identity]