from langgraph.graph import StateGraph,  START, END
from langchain_core.messages import AIMessage, HumanMessage
# from langchain_ollama import ChatOllama
from langgraph.graph.message import add_messages
from shared import State
from agents.information import create_information_subgraph
from agents.response import create_response_subgraph
from agents.supervisor import supervisor_node


workflow = StateGraph(State)
workflow.add_node("supervisor", supervisor_node)
workflow.add_node("information", create_information_subgraph())
workflow.add_node("response", create_response_subgraph())

workflow.add_edge("supervisor", "information")
workflow.add_edge("information", "response")
workflow.add_edge("response", END)

workflow.add_edge(START,"supervisor")

graph = workflow.compile()

def main(query="Which classes are interfaces?"):
    from sample_data import keycloak_data
    return graph.invoke({
            "project_name": "keycloak",
            "user_query": [HumanMessage(query)],
            "source_db": "uml-data",
            "repository_path": "/Users/yoseph/Work/Personal/keycloak",
            "github_url": "keycloak/keycloak",
            "docs_source": "https://www.keycloak.org/documentation"
            })

if __name__ == "__main__":
    print(main())