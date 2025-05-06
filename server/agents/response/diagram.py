from langchain_core.messages import BaseMessage, AIMessage
from langchain.output_parsers import PydanticOutputParser
from langchain_core.messages import BaseMessage, AIMessage
from shared import State, get_prompts, UMLClassDiagram
from helpers import get_agent, clean_string


AGENT_KEY = "diagram_painter"
llm = get_agent(AGENT_KEY)
prompt = get_prompts(AGENT_KEY)

def ensure_list(value):
    if isinstance(value, list):
        return [clean_string(l.content) for l in value]
    elif isinstance(value, str):
        return [BaseMessage(content=clean_string(value))]
    elif isinstance(value, BaseMessage):
        return [BaseMessage(content=clean_string(value.content))]
    else:
        return []

def response_diagram_node(state: State) -> State:
        """An LLM-based diagram updater"""
        original_diagram = state.get("original_diagram", None)
        if original_diagram:
            original_diagram = original_diagram[-1].to_json()
        
        input_data = {
            "user_query": ensure_list(state.get("user_query", [])),
            "original_diagram": [original_diagram],
            "source_response": ensure_list(state.get("source_response", [])),
            "git_response": ensure_list(state.get("git_response", [])),
            "github_response": ensure_list(state.get("github_response", [])),
            "docs_response": ensure_list(state.get("docs_response", [])),
            "context": ensure_list(state.get("context", [])),
        }
        try: 
            parser = PydanticOutputParser(pydantic_object=UMLClassDiagram)
            chain = prompt | llm | parser 
            result = chain.invoke(input_data)
            if result.get("type", None) is None:
                raise ValueError(f"No need to generate diagram")
            state["diagram_reply"] = result
        except Exception as e:
            state["diagram_reply"] = None
        return state
