import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Breadcrumb } from './types';
import { ConfigManager } from '../../services/configuration-manager';
import Container from 'typedi';
import { EventsService, StorageService } from '../../services';
import { IVLaPEvents } from '../../types';
import { DiagramService } from '../../services/diagram-service';
@customElement('breadcrumb-control')
export class BreadcrumbControl extends LitElement {
  @property({ type: Array })
  crumbs: Breadcrumb[]=[]

  @property({ type: Boolean })
  compact: boolean = false;
  @state()
  private isEnabled = false;
  @state()
  private onTour = false;

  protected configManager: ConfigManager;
  private storageService: StorageService;
  private eventsService: EventsService;
  private diagramService: DiagramService;
  static styles = css`
    :host {
      display: inline-block;
    }

    .breadcrumb-container {
      display: flex;
      align-items: center;
      border-radius: 30px;
      margin: 1em;
      padding: 4px 16px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    .breadcrumb-item {
      color: rgba(100, 100, 100, 0.7);
      font-weight: 500;
      font-size: 14px;
      padding: 4px 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .breadcrumb-item:hover:not(.active) {
      color: rgba(90, 90, 90, 0.9);
    }

    .breadcrumb-item.active {
      font-weight: 600;
      color: #6e48aa;
    }

    .separator {
      margin: 0 4px;
      color: rgba(50, 50, 50, 0.5);
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .breadcrumb-container.compact .breadcrumb-item:not(.active) {
        display: none;
      }
      
      .breadcrumb-container.compact .separator {
        display: none;
      }
      
      .breadcrumb-container.compact .breadcrumb-item.active {
        padding-left: 0;
      }
    }
  `;
  async firstUpdated() {
    this.crumbs = this.configManager.get("crumbValues") || [];
  }
  public constructor() {
    super();
    this.configManager = Container.get(ConfigManager);
    this.storageService = Container.get(StorageService);
    this.eventsService = Container.get(EventsService);
    this.diagramService = Container.get(DiagramService);
    this.eventsService.on(IVLaPEvents.DIAGRAM_CHANGE, ()=>{
      this.crumbs = this.storageService.getBreadCrumbs();
      this.requestUpdate();
    })
    this.eventsService.on(IVLaPEvents.CONTROL_OPTION_CHANGE, (data) => { 
      if(data.id == "breadcrumb") {
        this.isEnabled = data.value;
        this.requestUpdate();
      }
    });
    
    this.eventsService.on(IVLaPEvents.HELP_EVENT, (data) => { 
      if(data.id == "tour-ended") {
        this.onTour = true;
      }
      if(data.id == "tour-started") {
        this.onTour = false;
      }
      this.requestUpdate();
    });
    
  }

  private handleCrumbClick(crumb: Breadcrumb): void {
    if (!crumb.active) {
      let updatedCrumbs = []
      let c;
      for (let i=0; i<this.crumbs.length; i++){
        c = this.crumbs[i];
        if(c.id === crumb.id){
          updatedCrumbs[updatedCrumbs.length-1].active = true;
          break;
        }
        updatedCrumbs.push(c)
      }
        
      this.storageService.setBreadCrumbs(updatedCrumbs);
      this.diagramService.loadDiagram(crumb.label, crumb.id);
      // this.dispatchEvent(new CustomEvent('crumb-click', {
      //   detail: {
      //     value: crumb.id
      //   },
      //   bubbles: true,
      //   composed: true
      // }));
    }
  }

  render(): TemplateResult {
    return html`
      <div class="breadcrumb-container ${this.compact ? 'compact' : ''}"  style="display: ${this.isEnabled || this.onTour ? 'flex' : 'none'}">
        ${this.crumbs?.map((crumb, index) => html`
          ${index > 0 ? html`<span class="separator">›</span>` : ''}
          <span 
            class="breadcrumb-item ${crumb.active ? 'active' : ''}"
            @click=${() => this.handleCrumbClick(crumb)}
            role="link"
            tabindex="${crumb.active ? '-1' : '0'}"
            aria-current="${crumb.active ? 'page' : 'false'}"
          >
            ${crumb.label}
          </span>
        `)}
      </div>
    `;
  }
}