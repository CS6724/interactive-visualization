import { Visibility } from "./types";
import { UMLItem } from "./uml-item";
export interface UMLProperty extends UMLItem{
  dataType: string;
  visibility: Visibility;
  isStatic: boolean;
  isFinal: boolean;
  annotations?: string[];
  sourceLine?: number;
}