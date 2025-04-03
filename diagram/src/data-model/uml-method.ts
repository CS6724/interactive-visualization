import { Visibility } from "./types";
import { UMLItem } from "./uml-item";
import { UMLParameter } from "./uml-parameter";
export interface UMLMethod extends UMLItem{
  returnType: string;
  parameters: UMLParameter[];
  visibility: Visibility;
  annotations?: string[];
  isStatic: boolean;
  isAbstract: boolean;
  startingLine?: number;
  endingLine?: number;
}
