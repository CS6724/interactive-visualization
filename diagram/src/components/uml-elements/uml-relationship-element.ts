import { Geometry } from '@maxgraph/core';
import { UMLElement } from './uml-element';
import { UMLClass, UMLRelationship } from '../../data-model';

export class UMLRelationshipElement extends UMLElement{
    UML_RELATIONSHIP_STYLES: Record<string, string> = {
        inheritance: "endArrow=block;",
        interface_implementation: "endArrow=diamond;",
        association: "endArrow=classic;",
        aggregation: "endArrow=diamond;",
        composition: "endArrow=diamond;strokeWidth=2;",
        dependency: "endArrow=diamond;"
    };
    
    constructor(public data:UMLRelationship){
        super(data.name? data.name : '');
        this.id = data.id;
        this.edge = true;
        this.geometry = new Geometry();
        this.setConnectable(false);
        //@ts-ignore
        // this.setStyle(this.UML_RELATIONSHIP_STYLES[data.type]);
    }
    public update(data: UMLRelationship) {
        this.id = data.id;
        //@ts-ignore
        // this.setStyle(this.UML_RELATIONSHIP_STYLES[data.type]);
    }
} 