import { DiagramType } from "../types";
import { UMLItem } from "../uml-item";

export interface UMLDiagram {
    id?:string;
    language?: string;
    note?: string;
    name?: string;
    type:DiagramType;
}