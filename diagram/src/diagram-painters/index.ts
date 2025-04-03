import { DiagramType } from "../data-model";
import { UMLClassDiagramPainter } from "./uml-class-diagram-painter";
import { UMLPackageDiagramPainter } from "./uml-package-diagram-painter";

export * from "./uml-class-diagram-painter";
export * from "./uml-package-diagram-painter";
export * from "./uml-diagram-painter";
const painters = {
        "class": new UMLClassDiagramPainter(),
        "package": new UMLPackageDiagramPainter()
    }
export function getPainter(type: DiagramType): any {
    if (!painters[type]) {
        return painters["class"];
        //    throw Error("Unknown Diagram Type");
    }
    return painters[type];
}