import {UMLItem} from './uml-item';
export interface UMLParameter extends UMLItem{
  dataType: string;
  annotations?: string[];
}