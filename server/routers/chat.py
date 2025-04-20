from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from shared import UMLClassDiagram
from langchain_core.messages import HumanMessage

from pydantic import BaseModel
from shared import UMLClassDiagram
# from graph import graph
from agents.graph import graph


class DiagramUpdateRequest(BaseModel):
    diagram_data: UMLClassDiagram
    user_query: str

class DiagramUpdateResponse(BaseModel):
    diagram_data: UMLClassDiagram
    message: str


router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/", response_model=DiagramUpdateResponse)
def update_uml_diagram(request: DiagramUpdateRequest):
    try:
        # Parse the UML diagram using Pydantic validation

        result = graph.invoke({ 
            "user_query": [HumanMessage(request.user_query)],
            "source_db": "uml-data",
            "repository_path": "/Users/yoseph/Work/Personal/keycloak"
        })
        print("Done")

        print(result["chat_reply"].content)
        return DiagramUpdateResponse(
            diagram_data=request.diagram_data,
            message=result["chat_reply"].content
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse or update diagram: {str(e)}")
