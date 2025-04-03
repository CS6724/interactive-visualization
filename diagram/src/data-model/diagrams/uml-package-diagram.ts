import { DiagramType } from "../types";
import { UMLDiagram } from "./uml-diagram";
import { UMLClass } from "../uml-class";
import { UMLPackage } from "../uml-package";
import { UMLRelationship } from "../uml-relationship";
import { UMLItem } from "../uml-item";

export class UMLPackageDiagram implements UMLDiagram {
    packages: UMLPackage[] = [];
    classes?: UMLClass[] = [];
    relationships: UMLRelationship[] = [];
    type:DiagramType = "package";
}