import { LitElement, html, css } from 'lit';
import { customElement, state, query, property } from 'lit/decorators.js';
import { Graph } from '@maxgraph/core';

import './components/controls/diagram';
import './components/controls/perspective';
import './components/controls/breadcrumb';
import './components/controls/summary';
import './components/controls/chat';
import './components/controls/subdiagram';
import './components/controls/navigation';
import './components/controls/history';
import './components/controls/help';
import 'reflect-metadata';
import Container from 'typedi';

import { StorageService, ConfigManager, EventsService } from './services/';
import { DiagramControl, PerspectiveControl, BreadcrumbControl, SummaryTooltip, ChatControl, HelpControl, NavigationControl, HistoryControl } from './components/controls';
import { getPainter, UMLDiagramPainter } from './diagram-painters';
import { IVLaPEvents } from './types';
import { TourService } from './services/tour-service';
@customElement('uml-canvas')
export class UMLDiagramElement extends LitElement {
  private graph: Graph | null = null;
  private painter: UMLDiagramPainter;
  private storageService: StorageService;
  private eventsService: EventsService;
  private configManager: ConfigManager;

  @property({ type: Object })
  initialConfig: any = null;

  @state() private isChatOpen = false;

  @query('#graph-container') graphContainer: HTMLDivElement;
  @query('chat-control') chatControl!: ChatControl;
  @query('perspective-control') perspectiveControl!: PerspectiveControl;
  @query('breadcrumb-control') breadcrumbControl!: BreadcrumbControl;
  @query('diagram-control') diagramControl!: DiagramControl;
  @query('help-control') helpControl!: HelpControl;
  @query('navigation-control') navigationControl!: NavigationControl;
  @query('history-control') historyControl!:HistoryControl;
  @query('summaryTooltip') summaryTooltip!: SummaryTooltip;
  

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
    }
    #graph-container {
        margin: 0em !;
      }

    #entitySelect {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: white;
      font-size: 14px;
      margin-bottom: 10px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      appearance: none;
      /* Removes default browser styling */
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 16px;
    }

      #entitySelect:focus {
        outline: none;
        border-color: #4a90e2;
        box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
      }

      #entitySelect option {
        padding: 8px;
      }

      /* Form group styling */
      .form-group {
        margin-bottom: 15px;
      }

      .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: 500;
        color: #333;
      }

      #graph-container {
        width: 100%;
        height: 100vh;
        padding: 1em;

      }

      .uml-class {
        font-family: 'Segoe UI', Arial, sans-serif;
        background-color: white;
        border: 1px solid #2c3e50;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        display: inline-block;
        width: auto;
        min-width: 220px;
        padding: 0;
        margin: 10px;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }

      .data-type {
        font-weight: bold;
        color: #2980b9;
      }

      .uml-class-name {
        background: linear-gradient(to bottom, #3498db, #2980b9);
        color: white;
        font-weight: bold;
        text-align: center;
        padding: 8px 10px;
        border-bottom: 1px solid #2c3e50;
        border-radius: 3px 3px 0 0;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .uml-class-name .icon-container {
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
      }

      .note-icon,
      .selection-icon {
        cursor: pointer;
        margin-left: 6px;
        opacity: 0.85;
        transition: opacity 0.2s ease, transform 0.2s ease;
      }

      .note-icon:hover,
      .selection-icon:hover {
        opacity: 1;
        transform: scale(1.1);
      }

      .uml-class-properties {
        padding: 8px 10px;
        border-bottom: 1px solid #ddd;
        white-space: normal;
        min-height: 20px;
        text-align: left;
        background-color: #f8f9fa;
      }

      .uml-attribute:hover,
      .uml-method:hover {
        font-weight: bold;
        background-color: #f0f0f0;
      }

      .uml-class-methods {
        padding: 8px 10px;
        white-space: normal;
        min-height: 20px;
        text-align: left;
        background-color: #fff;
        border-radius: 0 0 3px 3px;
      }

      .member {
        margin-right: 6px;
      }

      .uml-class.selected {
        border: 2px solid #27ae60;
        box-shadow: 0 0 8px rgba(39, 174, 96, 0.4);
        transform: scale(1.02);
        transition: all 0.2s ease;
      }

      .uml-class.selected .uml-class-name {
        background: linear-gradient(to bottom, #27ae60, #219653);
      }

      /* Optional: Add a small indicator for selected classes */
      .uml-class.selected::before {
        content: "✓";
        position: absolute;
        top: -10px;
        left: -10px;
        background: #27ae60;
        color: white;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      perspective-control {
        margin-bottom: 2rem;
      }

      breadcrumb-trail {
        z-index: 1001
      }

      .uml-package {
        font-family: 'Segoe UI', Arial, sans-serif;
        background-color: white;
        border: 1px solid #2c3e50;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        display: inline-block;
        width: auto;
        min-width: 220px;
        padding: 15px;
        margin: 20px;
        position: relative;
      }

      .uml-package-header {
        font-family: 'Roboto', sans-serif;
        background: linear-gradient(to bottom, #3498db, #2980b9);
        color: white;
        font-weight: bold;
        padding: 5px 10px;
        border-radius: 4px 4px 0 0;
        position: absolute;
        top: -20px;
        left: 10px;
        border: 1px solid #2c3e50;
        border-bottom: none;
      }

      .uml-package-content {
        margin-top: 10px;
        padding-top: 15px;
        border-top: 2px solid #777;
      }
      

  `;
  constructor() {
    super()
    this.storageService = Container.get(StorageService);
    this.configManager = Container.get(ConfigManager);
    this.eventsService = Container.get(EventsService);

    this.eventsService.on(IVLaPEvents.NAVIGATION_EVENT, (data) => {
      if (data.type == 'zoomIn') {
        // this.graph!.zoom(1.2);
        this.graph!.zoomIn();
      } else if (data.type == 'zoomOut') {
        // this.graph!.zoom(0.8,true);
        this.graph!.zoomOut();
      } else if (data.type == 'reset') {
        this.graph!.fit();
        
      }
    })
    this.eventsService.on(IVLaPEvents.HELP_EVENT, (data)=>{
      if (data.type == 'start') {
        this._startTour();
      } else if (data.type == 'dismiss') {
        this._dismissTour(data.value)
      } 
    })

  }

  // Graph initialization
  async firstUpdated() {
    await this.storageService.init();
    if (this.storageService.diagramLoaded()) {
      this.updateDiagram();
    } else {
      this.drawDiagram();
    }

  }


  private preSetUpGraph() {
    // Clear the previous graph if it exists
    if (this.graph) {
      this.graph.destroy();
      this.graph = null;
    }
    this.graph = new Graph(this.graphContainer);
    this.storageService.setGraph(this.graph);


    this.graphContainer.addEventListener('wheel', (evt: WheelEvent) => {
      evt.preventDefault();
      evt.deltaY < 0 ? this.graph!.zoomIn() : this.graph!.zoomOut();
    });

    this.graph.convertValueToString = function (cell) {
      return cell.value?.nodeType === 1 ? cell.value : cell.value;
    };
    this.graph.setHtmlLabels(true);
    this.graph.setPanning(true);
    this.graph.setConnectable(false);
    this.graph.setCellsSelectable(true);
    this.graph.setCellsEditable(false);
    this.graph.setCellsResizable(false); // Prevents resizing
    this.graph.setEdgeLabelsMovable(false); // Prevents label movement
    this.graph.setAllowDanglingEdges(false); // Prevents unconnected edges
    this.graph.setDisconnectOnMove(false);
    this.graph.setCellsDisconnectable(false); // Prevents edges from being detached from nodes
    this.graph.setCellsMovable(true); // Disables movement of edges
    this.graph.container.addEventListener("contextmenu", function (event) {
      event.preventDefault(); // Disable the default right-click context menu
    });
    this.graph.view.setTranslate(0, 50);
  }

  private postSetUpGraph() {
    this.graph.setHtmlLabels(true);
    this.graph.refresh();
    this.graph.center();
    this.graph.fit();
  }

  public async drawDiagram(config?: any) {
    
    if (!this.graphContainer) {
      return;
    }
    this.preSetUpGraph();
    try {
      let painter: UMLDiagramPainter = getPainter(this.storageService.getCurrentDiagramType())

      painter.draw((detail) => {
        this.handleDiagramEvent(new CustomEvent('umlevent', {
          detail: detail,
          bubbles: true,
          composed: true
        }))
      })

      this.postSetUpGraph();
    } catch (Error) {
      console.log("Unknow diagram Type")
      console.log(Error)
    }

    this.setupListners();
  }

  public async updateDiagram() {
    if (!this.graphContainer) {
      return;
    }

    if (!this.graph) {
      this.preSetUpGraph();
    }
    try {
      if (!this.painter) {
        this.painter = getPainter(this.storageService.getCurrentDiagramType())
      }
      this.painter.update();
      this.postSetUpGraph();
    } catch (Error) {
      console.log("Unknow diagram Type")
      console.log(Error)
    }
  }


  // Start: Selection management
  // public toggleSelection(id: string) {
  //   const selectedElement = this.graph.container.querySelector(id);
  //   if (selectedElement) {
  //     selectedElement.classList.toggle('selected');
  //   }
  // }

  // End: Selection management

  // Start Chat control
  // public toggleChat(open?: boolean) {
  //   if (open !== undefined) {
  //     this.isChatOpen = open;
  //   } else {
  //     this.isChatOpen = !this.isChatOpen;
  //   }

  //   // Adjust the graph container padding
  //   if (this.graphContainer) {
  //     if (this.isChatOpen) {
  //       this.graphContainer.classList.add('chat-open');
  //     } else {
  //       this.graphContainer.classList.remove('chat-open');
  //     }
  //   }

  //   // You may need to refresh the graph after layout changes
  //   if (this.graph) {
  //     this.graph.refresh();
  //   }

  //   this.requestUpdate();
  // }

  // Event management
  public handleDiagramEvent(event: any) {
    if (event.detail.action === 'selection-toggled') {
      this.chatControl.openChat({ id: event.detail.id, type: event.detail.source });
      this.storageService.toggleSelection(event.detail.id);
      // this.toggleSelection(`#${CSS.escape(event.detail.id)}`)
    } else if (event.detail.action === 'open-note') {
      console.log(`Open Note`);
    } else if (event.detail.action === 'attribute') {
      console.log(`Open Attribute`);
    } else if (event.detail.action === 'method') {
      console.log(`Open Method`);
    } else if (event.detail.action === 'load') {
      console.log(`Open Summary ${event.detail.id}, Type ${event.detail.source}`);
    }
  }

  private setupListners() {
    let canvas = this;


    // Update diagram on data change
    this.eventsService.on(IVLaPEvents.DIAGRAM_CHANGE, () => { 
      if (!this.painter || this.painter.getType() != this.storageService.getCurrentDiagramType()) {
        this.drawDiagram();
      }else {
        this.updateDiagram() 
      }
    });
    this.configManager.on(IVLaPEvents.CONFIG_CHANGE, () => { this.updateDiagram() });


    // Listen to naviagation events
    this.eventsService.on(IVLaPEvents.NAVIGATION_EVENT, (e)=>{
      if (e.type == 'zoomIn'){
        this.graph.zoomIn()
      }else if(e.type == 'zoomOut'){
        this.graph.zoomOut()
      }else if(e.type == 'reset'){
        this.graph.fit()
      }
    });

    // START: Layer Control
    this.diagramControl.addEventListener("option-change", function (e: CustomEvent) {
      let diagramOptions = canvas.configManager.get("diagramOptions");
      let indexToUpdate = diagramOptions.findIndex(o => o.id == e.detail.value)
      if (indexToUpdate !== -1) {
        diagramOptions[indexToUpdate].selected = !diagramOptions[indexToUpdate].selected;
        canvas.configManager.set("diagramOptions", diagramOptions);
      }
     });
    // END: Layer Control


    // START: Chat Control
    this.chatControl.addEventListener("close-chat", function (e: CustomEvent) {
    });

    this.chatControl.addEventListener("clear-selection", function (e: CustomEvent) {
      this.storageService.clearSelections();
      e.preventDefault()
    });
    this.chatControl.addEventListener("toggle-selection", function (e: CustomEvent) {
      this.storageService.toggleSelection(e.detail.id)
    });
    // END: Chat Control


    // START: Perspective Control Event
    this.perspectiveControl.addEventListener("perspective-selected", function (e: CustomEvent) {
      console.log('Operspective option:', e.detail.value);
    });

    // END: Perspective Control Event

    // START: Subdiagram Control Event
    // this.subdiagramControl.addEventListener("subgraph-selected", function (e: CustomEvent) {
    //   console.log('Subgraph option:', e.detail.value);
    // });

    // END: Subdiagram Control Event

    // START: Breadcrumb Control Event
    this.breadcrumbControl.addEventListener("crumb-click", function (e: CustomEvent) {
      console.log('Crumb option:', e.detail.value);
    });
    // END: Breadcrumb Control Event

  }
  
  // End: Diagram editing

  // Render the diagram
  render() {
    return html`
      <div id="diagram">
        
        <breadcrumb-control></breadcrumb-control>
        <perspective-control></perspective-control>
        <div id="graph-container" class="${this.isChatOpen ? 'chat-open' : ''}"></div>
        <diagram-control></diagram-control>
        <summary-tooltip></summary-tooltip>
        <chat-control></chat-control>
        <navigation-control></navigation-control>
        <help-control></help-control>
        <history-control></history-control>
      </div>`;
  }

  private _startTour() {
    // import('./services/tour-service').then(({ TourService }) => {
      const elements = {
        graphContainer: this.shadowRoot?.querySelector('#diagram') as HTMLElement,
        historyControl: this.shadowRoot?.querySelector('history-control') as HTMLElement,
        navigationControl: this.shadowRoot?.querySelector('navigation-control') as HTMLElement,
        chatControl: (this.shadowRoot?.querySelector('chat-control')?.shadowRoot?.querySelector('.chat-toggle-btn')) as HTMLElement,
        diagramControl: (this.shadowRoot?.querySelector('diagram-control')?.shadowRoot?.querySelector('.controls-icon')) as HTMLElement,
        perspectiveControl: (this.shadowRoot?.querySelector('perspective-control')?.shadowRoot?.querySelector('.perspective-container')) as HTMLElement,
        breadcrumbControl: (this.shadowRoot?.querySelector('breadcrumb-control')?.shadowRoot?.querySelector('.breadcrumb-container')) as HTMLElement,
        helpControl: (this.shadowRoot?.querySelector('help-control')?.shadowRoot?.querySelector('.help-btn')) as HTMLElement
      };
      if (Object.values(elements).every(el => el)) {
        TourService.startTour(elements);
      }
    // });
  }
  
  private _dismissTour(show_again) {
    
    sessionStorage.setItem('umlTourPromptDismissed', 'true');
    
    if (!show_again) {
      localStorage.setItem('umlTourDone', 'true');
    }
    this.requestUpdate(); // re-render to hide prompt
  }
  
  public getCurrentDiagram(){
    return this.storageService.getCurrentDiagram();
  }
  public setCurrentDiagram(data){
    this.storageService.setCurrentDiagram(data);
  }
}