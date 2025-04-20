import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { ConfigManager } from '../../services/configuration-manager';
import Container from 'typedi';
import { EventsService } from '../../services';
import { IVLaPEvents } from '../../types';

@customElement('diagram-control')
export class DiagramControl extends LitElement {
  @state() 
  public options: { id: string; label: string; info: string, selected:boolean, editable:boolean }[];
  protected configManager: ConfigManager;
  private eventsService: EventsService;
  static styles = css`
    .float-container {
      position: fixed;
      bottom: 20px;
      left: 20px;
      border-radius: 4px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      padding: 4px;
      overflow: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
      background: white;
    }

    .float-container:hover {
      width: 200px;
      height: auto;
      max-height: 300px;
      padding: 8px;
    }

    .controls-header {
      display: flex;
      align-items: center;
      height: 20px;
      cursor: pointer;
    }

    .controls-icon {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    }

    .float-container:hover .controls-icon {
      margin-right: 8px;
    }

    .controls-icon svg {
      width: 16px;
      height: 16px;
      color: #666;
    }

    .controls-title {
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.3s ease;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      color: #333;
      display: none;
    }

    .float-container:hover .controls-title {
      opacity: 1;
      display: block;
    }

    .checkbox-list {
      opacity: 0;
      height: 0;
      transition: all 0.3s ease;
      display: none;
      flex-direction: column-reverse;
      margin-bottom: 8px;
    }

    .float-container:hover .checkbox-list {
      opacity: 1;
      height: auto;
      margin-top: 8px;
      display: block;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      margin: 8px 0;
      white-space: nowrap;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      color: #444;
      position: relative;
    }

    .checkbox-item input[type="checkbox"] {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      border: 2px solid #ddd;
      border-radius: 3px;
      margin-right: 8px;
      position: relative;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .checkbox-item input[type="checkbox"]:checked {
      background-color: #4285f4;
      border-color: #4285f4;
    }
    .checkbox-item input[type="checkbox"]:disabled {
      background-color: rgb(153, 156, 162);
      border-color:rgb(53, 56, 62);
    } 

    .checkbox-item input[type="checkbox"]:checked::after {
      content: '';
      position: absolute;
      left: 4px;
      top: 1px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .checkbox-item input[type="checkbox"]:hover {
      border-color: #4285f4;
    }
    .checkbox-item:hover input[type="checkbox"]:disabled {
      border-color: rgb(53, 56, 62);
      color: rgb(153, 156, 162);
    }

    .checkbox-item label {
      cursor: pointer;
      margin-right: 4px;
    }

    .checkbox-item:hover {
      color: #4285f4;
    }
  `;

  public constructor() {
    super();
    this.configManager = Container.get(ConfigManager);
    this.eventsService = Container.get(EventsService);
  }
  async firstUpdated() {
    ///TODO: read from local storage, if the options exist
    this.options = [
      { id: 'history', label: 'History', info: 'Show version history controls', selected: true, editable: true },
      { id: 'navigation', label: 'Navigation', info: 'Show navigation controls', selected: true, editable: true },
      { id: 'chat', label: 'Chat', info: 'Enable chat', selected: true, editable: true },
      { id: 'breadcrumb', label: 'Breadcrumb', info: 'Show breadcrumb controls', selected: false, editable: true },
      { id: 'perspectives', label: 'Perspectives', info: 'Show perspectives controls', selected: false, editable: true },
    ];
  }

  private handleCheckboxChange(event: Event, id: string) {
    const target = event.target as HTMLInputElement;
    this.eventsService.emit(IVLaPEvents.CONTROL_OPTION_CHANGE, {
      id: id,
      value: target.checked
    })
  }
  render() {
    return html`
      <div class="float-container">
        <div class="checkbox-list">
              ${this.options?.map(
                (option) =>
                  html`
                    <div class="checkbox-item">
                      <input type="checkbox" id="${option.id}" @change="${(e: Event) => this.handleCheckboxChange(e, option.id)}" .checked="${option.selected}" .disabled="${!option.editable}"/>
                      <label for="${option.id}">${option.label}</label>
                    </div>
                  `
              )}
        </div>
        <div class="controls-header">
          <div class="controls-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9"></path>
            </svg>
          </div>
          <span class="controls-title">Diagram Controls</span>
        </div>
            
      </div>
    `;
  }
}

