from typing import List
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq
from langchain.prompts import MessagesPlaceholder
from langchain.schema import SystemMessage, HumanMessage
from shared import UMLClassDiagram, State, system_prompts, user_prompts
from langchain.output_parsers import PydanticOutputParser

load_dotenv()

PROPMPT_KEY = "diagram_painter"

model_name = "deepseek-r1-distill-llama-70b"
llm = ChatGroq(model=model_name)

human_prompt = ("""
        User query: 
            {user_query}

        Original UML Diagram:
        
            {original_diagram}
            
        Responses from other agents:
            {agent_responses}


        Return the updated UMLClassDiagram JSON below:
        
        """)
# Full chain
def get_updated_uml_diagram(original_diagram: dict, user_query: str, agent_responses: List[str]):
	# model_name = "llama-3.3-70b-versatile"
	parser = PydanticOutputParser(pydantic_object=UMLClassDiagram)
	prompt = ChatPromptTemplate.from_messages([
		SystemMessage(content=system_prompts[PROPMPT_KEY]),
		HumanMessage(content=(user_prompts[PROPMPT_KEY].format(**{
                                "user_query":user_query,
                                "original_diagram":original_diagram,
                                "agent_responses":agent_responses })))
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
