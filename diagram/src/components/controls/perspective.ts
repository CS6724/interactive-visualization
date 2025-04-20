import { customElement, eventOptions, state } from 'lit/decorators.js';
import { LitElement, html, css } from 'lit';
import { ConfigManager } from '../../services/configuration-manager';
import Container from 'typedi';
import { EventsService } from '../../services';
import { IVLaPEvents } from '../../types';

@customElement('perspective-control')
export class PerspectiveControl extends LitElement {
  @state()
  public options: any[] = [];
  @state()
  selectedIndex: number;
  protected configManager: ConfigManager;
  @state()
  private isEnabled = false;
  private eventsService:EventsService;

  static styles = css`
        :host {
          display: block;
          width: 100%;
          font-family: 'Arial', sans-serif;
        }
    
        .perspective-container {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 30px;
          padding: 3px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          z-index:1001
        }
    
        .perspective-btn {
          border: none;
          background-color: transparent;
          padding: 8px 16px;
          cursor: pointer;
          color: rgba(0, 0, 0, 0.7);
          font-weight: 600;
          transition: all 0.3s ease;
        }
    
        .perspective-btn:first-child {
          border-radius: 30px 0 0 30px;
        }
    
        .perspective-btn:last-child {
          border-radius: 0 30px 30px 0;
        }
    
        .perspective-btn.active {
          background-color: rgba(255, 255, 255, 0.8);
          color: #6e48aa;
        }
    
      `;

  constructor() {
    super();
    this.selectedIndex = 0;

    this.configManager = Container.get(ConfigManager);
    this.configManager.on("config-change", (key) => {
      if (key == "perspectiveOptions") {
        this.options = this.configManager.get("perspectiveOptions") || [];
      }
    });

    this.eventsService = Container.get(EventsService);
          this.eventsService.on(IVLaPEvents.CONTROL_OPTION_CHANGE, (data) => { 
                if(data.id == "perspectives"){
                  this.isEnabled = data.value;
                  this.requestUpdate();
                }
              });
  }
  handleToggle(index) {
    this.selectedIndex = index;
    this.dispatchEvent(new CustomEvent('perspective-selected', {
      detail: {
        index: this.selectedIndex,
        value: this.options[this.selectedIndex].id
      },
      bubbles: true,
      composed: true
    }));
  }
  async firstUpdated() {
    this.options = this.configManager.get("perspectiveOptions") || [];
  }
  render() {
    return html`
            <div class="perspective-container" style="display: ${this.isEnabled ? 'flex' : 'none'}">
              ${this.options?.map((option, index) => html`
                <button
                  class="perspective-btn ${index === this.selectedIndex ? 'active' : ''}"
                  @click=${() => this.handleToggle(index)}
                >
                  ${option.label}
                </button>
              `)}
            </div>
        `;
  }
}
