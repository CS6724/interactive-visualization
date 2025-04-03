import { RelationshipType } from "./types";
import { UMLItem } from "./uml-item";
export interface UMLRelationship extends UMLItem{
  source: string;
  target: string;
  type?: RelationshipType;
  multiplicity?: string;
}