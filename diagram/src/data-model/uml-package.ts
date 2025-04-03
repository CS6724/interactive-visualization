import { UMLClass } from "./uml-class";
import { UMLItem } from "./uml-item";

export interface UMLPackage extends UMLItem{
  // files?: string[];
  subpackages?: UMLPackage[];
  classes?: UMLClass[];
  on_click?: string;
}