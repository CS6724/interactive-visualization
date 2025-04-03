from dotenv import load_dotenv
import json

from typing import List, Optional, Literal
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain.prompts import MessagesPlaceholder
from langchain.schema import SystemMessage, HumanMessage
from data_models import UMLClassDiagram
from langchain.output_parsers import PydanticOutputParser
from common import State
load_dotenv()


response_system_prompt = """
			You are an agent working as UML diagram assistant. You are working with other agents that can answer questions by the user. 
			Given a UMLClassDiagram in JSON format, and the question asked by the user and the responses from your colleagues your taks is to return an updated UMLClassDiagram.

			Only update the relevant parts. Do NOT remove or exclude any existing UMLClass objects or UMLRelationship objects that were not modified.

			Each class must follow this structure:
			- id: string
			- domId: string
			- name: string
			- ...
			- annotations: list of strings (e.g., ["@Entity"])
			- properties: list of UMLProperty
			- methods: list of UMLMethod

			All annotations must be a list of strings, even if empty.

			Avoid setting values to null unnecessarily. If a value is not changed, retain the original one.

			Your response must be a valid JSON representation of the entire UMLClassDiagram.
			⚠️ This includes both:
			- The `classes` field (list of UMLClass objects)
			- The `relationships` field (list of UMLRelationship objects)
			Even if you did not modify any relationships, you must include the original `relationships` list exactly as it was.

			If the best way to respond to the user query is to highlight a specific class, property, method, or relationship, then set its `selected` field to `true`.

			- Do NOT set selected=true arbitrarily.
			- Use selected=true only when it helps visually guide the user to the relevant part of the diagram.
			- You can set selected=true on more than one element, but prefer highlighting the minimal set that answers the query.

			If the best way to respond to the user query is to filter out a specific class, property, method, or relationship, then you can remove those classes , property, method, or relationship from your responses
			- Do NOT remove things arbitrarily.
			- Remove an element only when it helps visually guide the user to the relevant part of the diagram.
			- You can remove more than one element, but prefer not to remove anything unless that answers the query best.

"""

model_name = "deepseek-r1-distill-llama-70b"
llm = ChatGroq(model=model_name)

# Full chain
def get_updated_uml_diagram(original_diagram: dict, user_query: str, agent_responses: List[str]):
	# model_name = "llama-3.3-70b-versatile"
	parser = PydanticOutputParser(pydantic_object=UMLClassDiagram)
	prompt = ChatPromptTemplate.from_messages([
		SystemMessage(content=response_system_prompt),
		HumanMessage(content=(
			f"User query:\n{user_query}\n\n"
			f"Original UML Diagram:\n{original_diagram}\n\n"
			f"Responses from other agents:\n{agent_responses}\n\n"
			"Return the updated UMLClassDiagram JSON below:"
		))
	])

	chain = prompt | llm | parser
	return chain.invoke({})

def diagram_response_node(state: State) -> State:
        """An LLM-based diagram updater"""
        original_diagram = state["original_diagram"]
        query = state["user_query"][-1].content
        responses = [ 
        		state["source_response"], 
        		# state["history_response"],
        		# state["docs_response"]
        	]
        # print(original_diagram)
        updated_diagram =  get_updated_uml_diagram(original_diagram, query, responses)
        state["updated_diagram"] = updated_diagram
        return state
