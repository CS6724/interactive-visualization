import { DiagramType } from "../types";
import { UMLClass } from "../uml-class";
import { UMLDiagram } from "./uml-diagram";
import { UMLRelationship } from "../uml-relationship";
import { UMLItem } from "../uml-item";

export class UMLClassDiagram implements UMLDiagram {
    classes: UMLClass[] = [];
    relationships: UMLRelationship[] = [];
    type:DiagramType = "class";
}