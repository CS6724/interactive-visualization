import { Graph, constants, CellStyle, HierarchicalLayout } from '@maxgraph/core';
import { UMLPackageElement, UMLRelationshipElement } from '../components/uml-elements/';
import { UMLPackageDiagram } from '../data-model/diagrams/uml-package-diagram';
import { DataService } from '../services';
import { StorageService } from '../services/storage-service';
import Container from 'typedi';
import { UMLDiagramPainter } from './uml-diagram-painter';
import { DiagramType } from '../data-model';

export class UMLPackageDiagramPainter  extends UMLDiagramPainter{
    public constructor() {
        super();
    }
    public init(graph: Graph, data: UMLPackageDiagram, diagramOptions: any[], eventHandler) {
        graph.model.beginUpdate();
        try {
            let nodes = {}
            data.packages.forEach((c) => {
                let cell = new UMLPackageElement(c, diagramOptions)
                nodes[c.id] = cell
                graph.model.add(graph.getDefaultParent(), cell);
                cell.on("click", eventHandler);
            });

            let edges = {}
            if (data.relationships) {
                data.relationships.forEach((r) => {
                    let edge = new UMLRelationshipElement(r);
                    edges[r.id] = edge
                    graph.model.add(graph.getDefaultParent(), edge);
                    graph.model.setTerminal(edge, nodes[r.source], true);
                    graph.model.setTerminal(edge, nodes[r.target], false);

                });
            }

            let layout = new HierarchicalLayout(graph);

            layout.execute(graph.getDefaultParent());

        } catch (error) {
            console.log("Error updating")
            console.log(error)
        }
        finally {
            graph.model.endUpdate();
        }
    }

    public draw(handler?) {
        if (handler) {
            this.eventHandler = handler
        }
        let graph = this.storageService.getGraph()
        let data = this.storageService.getCurrentDiagram() as UMLPackageDiagram;
        /// TODO: Move to the class element
        let diagramOptions = this.configManager.get("diagramOptions");
        graph.model.beginUpdate();
        try {
            let nodes = {}
            data.packages.forEach((c) => {
                let cell = new UMLPackageElement(c, diagramOptions)
                nodes[c.id] = cell
                graph.model.add(graph.getDefaultParent(), cell);
                cell.on("click", this.eventHandler);
            });

            let edges = {}
            if (data.relationships) {
                data.relationships.forEach((r) => {
                    let edge = new UMLRelationshipElement(r);
                    edges[r.id] = edge
                    graph.model.add(graph.getDefaultParent(), edge);
                    graph.model.setTerminal(edge, nodes[r.source], true);
                    graph.model.setTerminal(edge, nodes[r.target], false);

                });
            }

            let layout = new HierarchicalLayout(graph);

            layout.execute(graph.getDefaultParent());

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
        }
    }

    public getType(): DiagramType {
            return "package";
        }

}