from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from shared import UMLClassDiagram, DuvetRequest, DuvetResponse
from langchain_core.messages import HumanMessage
from typing import Optional

from pydantic import BaseModel
from shared import UMLClassDiagram
# from graph import graph
from agents.graph import graph


class DiagramUpdateRequest(BaseModel):
    diagram_data: UMLClassDiagram
    user_query: str

class DiagramUpdateResponse(BaseModel):
    retry: Optional[bool] = False
    diagram_data: Optional[UMLClassDiagram] = None
    message: Optional[str] = ""


router = APIRouter(prefix="/chat", tags=["chat"])
MAX_TRY = 3

@router.post("/", response_model=DuvetResponse)
def update_uml_diagram(request: DuvetRequest):
    attempt = request.attempt
    if attempt < MAX_TRY:
        attempt+=1
        try:
            # Parse the UML diagram using Pydantic validation
            result = graph.invoke({
                "project_name": request.project_name, # "keycloak"
                "original_diagram": [request.current_diagram], # UMLClassDiagram
                "user_query": [HumanMessage(request.user_query)],
                "source_db": request.source_db, # "uml-data"
                "repository_path": request.repository_path, #"/Users/yoseph/Work/Personal/keycloak",
                "github_url": request.github_url, #"keycloak/keycloak",
                "docs_source": request.docs_source, #"https://www.keycloak.org/documentation"
                "context": [HumanMessage("User is currently viewing diagrams " + request.current_view + " for the project " + request.project_name),  
                            HumanMessage("User Selected " + (str(request.current_selection) if len(request.current_selection) > 0 else "nothing")),
                            HumanMessage("Pervious converation history: " + (str(request.history) if len(request.history) > 0 else ""))]})
           

            response = DuvetResponse(
                attempt=attempt,
                message=result["chat_reply"].content,
                actions = []
            )
            
            if result.get("diagram_reply") is not None:
                response.actions.append("update")
                print(result["diagram_reply"])
                response.updated_diagram = result["diagram_reply"]

            if result.get("navigation_reply") is not None:
                response.actions.append("navigate")
                response.navigateTo = result["navigation_reply"]
            return response
        except Exception as e:
            print(e)
            return DuvetResponse(
                attempt=attempt,
                retry=True,
                message="Some error encounterd, I will try again",
                actions = ["retry"],
                
            )
    else:
        return  DuvetResponse(
                attempt=attempt,
                message="Error was hard to recover from. Please try later",
                actions = ["fail"]
                )