import 'reflect-metadata';
import Container, { Inject, Service } from 'typedi';
import { DiagramType, UMLClassDiagram, UMLDiagram } from '../data-model';
import { DataService } from './data-service';
import { Breadcrumb } from '../components/controls';
import { Graph } from '@maxgraph/core';
import { IVLaPEvents } from '../types';
import { ConfigManager } from './configuration-manager';
import { EventsService } from './event-service';

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
  private eventsService: EventsService;
  private configService: ConfigManager;

  /**
   * An internal stack of diagrams representing the user's navigation history. 
   * The latest entry is considered the current diagram.
   */
  private diagramData: UMLDiagram[] = [];

  /**
   * A breadcrumb-like data structure for tracking navigation (not yet fully implemented).
   */
  private breadcrumbs: Breadcrumb[];

  /**
   * A shared `Graph` instance from the `@maxgraph/core` library.
   */
  private graph: Graph;

  private selections = [];

  private currentView = "root";
  /**
   * Initializes the `StorageService` and retrieves the `DataService` instance from the container.
   */
  constructor() {//}, @Inject() private configService:ConfigManager) {
    this.dataService = Container.get(DataService);
    this.configService = Container.get(ConfigManager);
    this.eventsService = Container.get(EventsService);
    this.breadcrumbs = [];
  }

  /**
   * Sets the current `Graph` instance and emits a `GRAPH_CHANGE` event.
   *
   * @param g - The `Graph` instance to store.
   */
  public setGraph(g: Graph): void {
    this.graph = g;
    this.eventsService.emit(IVLaPEvents.GRAPH_CHANGE, this.graph);
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
    this.breadcrumbs.forEach(b=>{b.active = false});
    this.breadcrumbs.push({
      id: url,
      label: name,
      active: true,
    })
  }
  
  public getBreadCrumbs(): Breadcrumb[]{
    return this.breadcrumbs;
  }
  public setBreadCrumbs(breadcrumbs: Breadcrumb[]){
    this.breadcrumbs = breadcrumbs;
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
  public setCurrentDiagram(diagram: UMLDiagram, inPlace = false): void {
    if(inPlace && this.diagramData.length>0){
      this.diagramData[this.diagramData.length-1] = diagram;
    }else {
      this.diagramData.push(diagram);
    }
    
    this.eventsService.emit(IVLaPEvents.DIAGRAM_CHANGE, diagram);
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
    this.eventsService.emit(IVLaPEvents.DIAGRAM_CHANGE, returnValue);
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
  public getSelected(){
    return this.selections;
  }
  public clearSelections(){
    if(this.selections.length==0){
      return;
    }
    this.selections = []
    if(this.getCurrentDiagramType()==="class"){
      const diagram = this.getCurrentDiagram() as UMLClassDiagram;
      diagram.classes = diagram.classes.map(c => {
        if (c.selected) {
          return { ...c, selected: false };
        } else {
          return c;
        }
      })
      this.setCurrentDiagram(diagram,true);
    }else if(this.getCurrentDiagramType()==="package"){
      // alert("Not Supported Yet")
    }else{
      // alert("Not Supported Yet")
    }
  }
  public toggleSelection(id) {
    if(this.selections.includes(id)){
      this.selections = this.selections.filter((s)=>s!==id)
    }else{
      this.selections.push(id)
    }
    if(this.getCurrentDiagramType()==="class"){
      const diagram = this.getCurrentDiagram() as UMLClassDiagram;
      diagram.classes = diagram.classes.map(c => {
        if (c.id==id) {
          return { ...c, selected: !c.selected };
        } else {
          return c;
        }
      })
      this.setCurrentDiagram(diagram,true);
    }else if(this.getCurrentDiagramType()==="package"){
      alert("Not Supported Yet")
    }else{
      alert("Not Supported Yet")
    }

  }

  public getCurrentView(){
    if (!this.breadcrumbs || this.breadcrumbs.length === 0) {
      return "root";
    }
  
    return this.breadcrumbs.map(b => b.label).join(".");
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
}