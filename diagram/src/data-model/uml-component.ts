import { UMLClass } from "./uml-class";
import { UMLItem } from "./uml-item";
import { UMLRelationship } from "./uml-relationship";

export interface UMLComponent extends UMLItem{
  classes: UMLClass[];
  subcomponents: UMLComponent[];
  dependencies: UMLRelationship[];
}