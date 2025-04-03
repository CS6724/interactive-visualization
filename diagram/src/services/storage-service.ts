import 'reflect-metadata';
import Container, { Inject, Service } from 'typedi';
import { DiagramType, UMLClassDiagram, UMLDiagram } from '../data-model';
import { DataService } from './data-service';
import { Breadcrumb } from '../components/controls';
import { Graph } from '@maxgraph/core';
import { IVLaPEvents } from '../types';
import { ConfigManager } from './configuration-manager';

/**
 * Provide singlton storage service for the entire package
 *    - What is stored
 *        - diagram data
 *        - diagram components (e.g. graph object)
 *    - Supports
 *       - History(Breadcrum/Back and forward navigation) storage 
 *       - jumping to different history points
 */
@Service()
export class StorageService {
  private dataService: DataService;
  private configService: ConfigManager;

  /**
   * An internal stack of diagrams representing the user's navigation history. 
   * The latest entry is considered the current diagram.
   */
  private diagramData: UMLDiagram[] = [];

  /**
   * A breadcrumb-like data structure for tracking navigation (not yet fully implemented).
   */
  private breadcrums: Breadcrumb[];

  /**
   * A shared `Graph` instance from the `@maxgraph/core` library.
   */
  private graph: Graph;

  /**
   * A dictionary of event types to arrays of event listeners. Provides a simple 
   * publish-subscribe mechanism for changes in the service.
   */
  private events: { [key: string]: Function[] } = {};

  /**
   * Initializes the `StorageService` and retrieves the `DataService` instance from the container.
   */
  constructor() {//}, @Inject() private configService:ConfigManager) {
    this.dataService = Container.get(DataService);
    this.configService = Container.get(ConfigManager);
    this.breadcrums = [];
  }

  /**
   * Sets the current `Graph` instance and emits a `GRAPH_CHANGE` event.
   *
   * @param g - The `Graph` instance to store.
   */
  public setGraph(g: Graph): void {
    this.graph = g;
    this.emit(IVLaPEvents.GRAPH_CHANGE, this.graph);
  }

  /**
   * Retrieves the currently stored `Graph` instance.
   *
   * @returns The stored `Graph` instance, or `undefined` if none is set.
   */
  public getGraph(): Graph {
    return this.graph;
  }

  public async init(config?: any) {
    //TODO: 
    let path = 'classes';
   

    // Fetch data
    // const response = await this.dataService.fetchData(path+"?package=org.keycloak.themeverifier");
    const response = await this.dataService.fetchData("packages"+"?package=org");
    // Load data
    this.setCurrentDiagram(response["data"]);

    // Load Config
    this.configService.set("diagramOptions", [
      { id: 'properties', label: 'Properties', info: 'Displays properties for each class', selected: true, editable: true },
      { id: 'methods', label: 'Methods', info: 'Displays methods for each class', selected: true, editable: true },
      { id: 'summary', label: 'Summary on Hover', info: 'Displays summary for each class', selected: true, editable: true },
      { id: 'chat', label: 'Chat', info: 'Enable chat', selected: true, editable: true },
      { id: 'history', label: 'History', info: 'Show version history control', selected: true, editable: true }
    ]);

    this.configService.set("perspectiveOptions", [
      { label: 'Package', id: "package" },                   //     {label:'Structural', id:"structural" },
      { label: 'Files', id: "files" },       //     {label:'Behavioral', id:"behavioral" },
      { label: 'Deployment', id: "deployment" }             //     {label:'Data Flow', id:"data-flow"}
    ]);

    // this.configService.set("subdiagramOptions", configuration["subdiagram"]);
    this.configService.set("subdiagramOptions", [
      { label: 'Java', id: "java" },                   //     {label:'Structural', id:"structural" },
      { label: 'TypeScript', id: "typescript" },       //     {label:'Behavioral', id:"behavioral" },
      { label: 'Database', id: "database" }             //     {label:'Data Flow', id:"data-flow"}
    ]);

    // this.configService.set("crumbValues", configuration["crumb"]);    
    this.configService.set("crumbValues", [
      { id: 'Root', label: 'Root' },
      { id: 'package_1', label: 'Package 1' },
      { id: 'sub_package_1.1', label: 'Sub Package 1.1', active: true }
    ]);

    // this.configService.set("diagramOptions", configuration["diagramOptions"]);
    this.configService.set("diagramOptions", [
      { id: 'properties', label: 'Properties', info: 'Displays properties for each class', selected: true, editable: true },
      { id: 'methods', label: 'Methods', info: 'Displays methods for each class', selected: true, editable: true },
      { id: 'summary', label: 'Summary on Hover', info: 'Displays summary for each class', selected: true, editable: true },
      { id: 'subpackages', label: 'Subpackages', info: 'Displays subpackages for each package', selected: true, editable: true },
      { id: 'classes', label: 'Classes', info: 'Displays classes for each package', selected: true, editable: true }
    ]);
    //TODO: Update this to response["config"]


  }

  public pushBreadcrum(name, url){
    this.breadcrums.forEach(b=>{b.active = false});
    this.breadcrums.push({
      id: url,
      label: name,
      active: true,
    })
    console.log(this.breadcrums);
  }
  
  public getBreadCrumbs(): Breadcrumb[]{
    return this.breadcrums;
  }
  public setBreadCrumbs(breadcrums: Breadcrumb[]){
    this.breadcrums = breadcrums;
  }
  public diagramLoaded(): boolean {
    //TODO: Setup storage and Check if the diagram exists
    return false;
  }
  /**
   * Pushes a new `UMLDiagram` onto the navigation stack, making it the current diagram. 
   * Also emits a `DIAGRAM_CHANGE` event with the newly added diagram.
   *
   * @param diagram - The diagram to set as the current diagram.
   */
  public setCurrentDiagram(diagram: UMLDiagram): void {
    this.diagramData.push(diagram);
    this.emit(IVLaPEvents.DIAGRAM_CHANGE, diagram);
  }

  /**
   * Retrieves the most recent (current) diagram from the navigation stack.
   *
   * @returns The current `UMLDiagram`, or `null` if no diagrams exist.
   */
  public getCurrentDiagram(): UMLDiagram {
    let returnValue: UMLDiagram = null;
    if (this.diagramData && this.diagramData.length > 0) {
      returnValue = this.diagramData[this.diagramData.length - 1];
    }
    return returnValue;
  }

  /**
   * Retrieves the diagram before the current one, effectively the "previous" diagram 
   * in the navigation stack.
   *
   * @returns The previous `UMLDiagram`, or `null` if there is no previous diagram.
   */
  public getPerviousDiagram(): UMLDiagram {
    let returnValue: UMLDiagram = null;
    if (this.diagramData && this.diagramData.length > 1) {
      returnValue = this.diagramData[this.diagramData.length - 2];
    }
    return returnValue;
  }

  /**
   * Navigates to the diagram at the specified index in the navigation stack, 
   * truncating the stack to that index (inclusive). This method then emits a 
   * `DIAGRAM_CHANGE` event with the navigated-to diagram.
   *
   * @param index - The zero-based index of the diagram in the stack to navigate to.
   * @returns The `UMLDiagram` at the specified index, or `null` if the index is out of range.
   */
  public navigateToDiagram(index: number): UMLDiagram {
    let returnValue: UMLDiagram = null;
    if (this.diagramData && this.diagramData.length > index) {
      returnValue = this.diagramData[index];
    }
    // Potentially remove diagrams after the specified index
    this.diagramData = this.diagramData.slice(0, index + 1);
    this.emit(IVLaPEvents.DIAGRAM_CHANGE, returnValue);
    return returnValue;
  }

  /**
   * Navigates to the previous diagram in the navigation stack, if one exists.
   *
   * @returns The previously active `UMLDiagram`, or `null` if no such diagram exists.
   */
  public navigateToPervious(): UMLDiagram {
    if (this.diagramData && this.diagramData.length > 1) {
      return this.navigateToDiagram(this.diagramData.length - 2);
    } else {
      return null;
    }
  }

  /**
   * Retrieves the type of the current diagram, as indicated by its `DiagramType` property.
   *
   * @returns The `DiagramType` of the current `UMLDiagram`, or `null` if no diagrams are present.
   */
  public getCurrentDiagramType(): DiagramType {
    let returnValue: DiagramType = null;
    const diagram: UMLDiagram = this.getCurrentDiagram();
    if (diagram) {
      returnValue = diagram.type;
    }
    return returnValue;
  }

  public toggleSelection(id) {
    // let item = this.getCurrentDiagram().findMember(id);
    // if (item) {
    //   console.log(item)
    //   item.selected = !item.selected;
    //   this.emit(IVLaPEvents.DIAGRAM_CHANGE, id);
    // }

  }
  /**
   * TODO
   */
  public saveLayout() {
    if (!this.graph) return;

    const cells = this.graph.getChildCells(); // Get all nodes in the graph
    const layoutData = cells.map(cell => ({
      id: cell.id,
      geometry: {
        x: cell.geometry.x,
        y: cell.geometry.y,
        width: cell.geometry.width,
        height: cell.geometry.height
      }
    }));

    // Store in localStorage (or send to backend)
    /// TODO: save per diagram id
    localStorage.setItem('graphLayout', JSON.stringify(layoutData));

    console.log("Layout saved:", layoutData);
  }

  public restoreLayout() {
    if (!this.graph) return;

    /// TODO: load per diagram id
    const layoutData = localStorage.getItem('graphLayout');
    if (!layoutData) return;

    const parsedData = JSON.parse(layoutData);

    parsedData.forEach(({ id, geometry }) => {
      const cell = this.graph.model.getCell(id);
      if (cell && cell.geometry) {
        this.graph.model.beginUpdate();
        try {
          cell.geometry.x = geometry.x;
          cell.geometry.y = geometry.y;
          cell.geometry.width = geometry.width;
          cell.geometry.height = geometry.height;
        } finally {
          this.graph.model.endUpdate();
        }
      }
    });

    console.log("Layout restored:", parsedData);
  }



  /**
   * Subscribes a listener function to a specific event.
   *
   * @param event - The name of the event to listen for (e.g., `GRAPH_CHANGE`, `DIAGRAM_CHANGE`).
   * @param listener - The callback function to invoke when the event is emitted.
   *
   * @example
   * ```ts
   * storageService.on(IVLaPEvents.DIAGRAM_CHANGE, (diagram) => {
   *   console.log('Diagram changed:', diagram);
   * });
   * ```
   */
  public on(event: string, listener: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  /**
   * Unsubscribes a previously registered listener function from a specific event.
   *
   * @param event - The name of the event to stop listening to.
   * @param listener - The callback function to remove from the event's listener list.
   */
  public off(event: string, listener: Function): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  /**
   * Emits (triggers) a specified event with optional arguments to pass to each subscribed listener.
   *
   * @param event - The name of the event to emit.
   * @param args - Additional arguments to pass to each listener.
   *
   * @example
   * ```ts
   * storageService.emit(IVLaPEvents.DIAGRAM_CHANGE, currentDiagram);
   * ```
   */
  public emit(event: string, ...args: any[]): void {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(...args));
  }
}