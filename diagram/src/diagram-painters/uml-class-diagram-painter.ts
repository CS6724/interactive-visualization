import { Graph, constants, CellStyle, HierarchicalLayout, Cell, Geometry } from '@maxgraph/core';
import { DiagramType, UMLClassDiagram } from "../data-model";
import { UMLClassElement, UMLRelationshipElement } from '../components/uml-elements';
import { UMLDiagramPainter } from './uml-diagram-painter';

export class UMLClassDiagramPainter extends UMLDiagramPainter {

    private nodes = {};
    private edges = {};
    public constructor() {
        super();
    }
    public draw(handler?) {
        if (handler) {
            this.eventHandler = handler
        }
        let graph = this.storageService.getGraph()
        let data = this.storageService.getCurrentDiagram() as UMLClassDiagram;
        /// TODO: Move to the class element
        let diagramOptions = this.configManager.get("diagramOptions");
        graph.model.beginUpdate();
        try {
            data.classes.forEach((c) => {
                let cell = new UMLClassElement(c, diagramOptions)
                this.nodes[c.id] = cell
                graph.model.add(graph.getDefaultParent(), cell);
                cell.on("click", this.eventHandler);
            });

            data.relationships.forEach((r) => {
                let edge = new UMLRelationshipElement(r);
                this.edges[r.id] = edge
                graph.model.add(graph.getDefaultParent(), edge);
                graph.model.setTerminal(edge, this.nodes[r.source], true);
                graph.model.setTerminal(edge, this.nodes[r.target], false);

            });
            this.layout = new HierarchicalLayout(graph);

            this.layout.execute(graph.getDefaultParent());

        } catch (error) {
            console.log("Error updating")
            console.log(error)
        }
        finally {
            graph.model.endUpdate();
        }
    }

    public update(redraw: boolean = false) {
        if (redraw) {
            this.draw();
        } else {

            /// TODO: Remove the diagrams not updated
            /// 1. Find new elements and create them
            /// 2. Remove missing elements
            /// 3. Update the updated ones.
            
            let graph = this.storageService.getGraph();
            let data = this.storageService.getCurrentDiagram() as UMLClassDiagram;
            let diagramOptions = this.configManager.get("diagramOptions");
            
            graph.model.beginUpdate();

            // Update Classes
            const existingClasses =  new Set(Object.keys(this.nodes))
            const updatedClasses =  new Set(data.classes.map(c=>c.id))
            
            // Update Relationsips
            const existingRelationships =   new Set(Object.keys(this.edges))
            const updatedRelationships =  new Set(data.relationships.map(r=>r.id))
    
            
            // Handle 'Remove' changes for classes
            existingClasses.forEach((c) => {
                if (!updatedClasses.has(c)) {
                    const cell = graph.model.getCell(c);
                    if (cell) {
                        graph.model.remove(cell);
                    }
                    delete this.nodes[c];  // Remove from local map
                }
            });

            // Handle 'Remove' changes for relationships
            existingRelationships.forEach((r) => {
                if (!updatedRelationships.has(r)) {
                    const cell = graph.model.getCell(r);
                    if (cell) {
                        graph.model.remove(cell);
                    }
                    delete this.edges[r]; // Remove from local map
                }
            });
            


            // Handle 'Add or Update' changes for classes
            data.classes.forEach((c) => {
                let cell = graph.model.getCell(c.id);
                if (cell instanceof UMLClassElement) {
                    (cell as UMLClassElement).update(c, diagramOptions);
                } else {
                    let node = new UMLClassElement(c, diagramOptions);
                    graph.addCell(node, graph.getDefaultParent());
                    this.nodes[c.id] = node;
                }
            });

            // Handle 'Add or Update' changes for relationships
            data.relationships.forEach((r) => {
                let cell = graph.model.getCell(r.id);
                if (cell instanceof UMLRelationshipElement){
                    (cell as UMLRelationshipElement).update(r);
                } else{
                    let edge = new UMLRelationshipElement(r);
                    graph.addEdge(edge, graph.getDefaultParent(), this.nodes[r.source], this.nodes[r.target]);
                    this.edges[r.id] = edge;
                }
            });

            graph.refresh();
            graph.model.endUpdate();
        }
    }
    public getType(): DiagramType {
        return "class";
    }
}