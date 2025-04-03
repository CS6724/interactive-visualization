import { UMLMethod } from "./uml-method";
import { UMLProperty } from "./uml-property";
import { UMLItem } from "./uml-item";

export interface UMLClass extends UMLItem{
  package?: string;
  files?: string[];
  annotations?: string[];
  properties: UMLProperty[];
  methods: UMLMethod[];
  isAbstract: boolean;
  isInterface: boolean;
}
