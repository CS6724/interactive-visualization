import { customElement, eventOptions, state } from 'lit/decorators.js';
import { LitElement, html, css } from 'lit';
import { ConfigManager } from '../../services/configuration-manager';
import Container from 'typedi';
import { EventsService } from '../../services';
import { IVLaPEvents } from '../../types';

@customElement('subdiagram-control')
export class SubdiagramControl extends LitElement {
  @state()
  public options: any[] = [];
  @state()
  selectedIndex: number;
  @state()
  private isEnabled = false;
  @state()
  private onTour = false;
  protected configManager: ConfigManager;
  private eventsService: EventsService

  static styles = css`
        :host {
          display: block;
          width: 100%;
          font-family: 'Arial', sans-serif;
        }
    
        .subdiagram-container {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 30px;
          padding: 3px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          z-index:1001
        }
    
        .subdiagram-btn {
          border: none;
          background-color: transparent;
          padding: 8px 16px;
          cursor: pointer;
          color: rgba(0, 0, 0, 0.7);
          font-weight: 600;
          transition: all 0.3s ease;
        }
    
        .subdiagram-btn:first-child {
          border-radius: 30px 0 0 30px;
        }
    
        .subdiagram-btn:last-child {
          border-radius: 0 30px 30px 0;
        }
    
        .subdiagram-btn.active {
          background-color: rgba(255, 255, 255, 0.8);
          color: #6e48aa;
        }
    
      `;
  constructor() {
    super();
    this.selectedIndex = 0;
    this.configManager = Container.get(ConfigManager);
    this.eventsService = Container.get(EventsService);
    this.configManager.on("config-change", (key) => {
      if (key == "subdiagramOptions") {
        this.options = this.configManager.get("subdiagramOptions") || [];
      }
    });
    this.eventsService.on(IVLaPEvents.HELP_EVENT, (data) => {
      if (data.type == "start") {
        this.onTour = true;
      }
      if (data.type == "end") {
        this.onTour = false;
      }
      this.requestUpdate();
    });
  }
  handleToggle(index) {
    this.selectedIndex = index;
    this.dispatchEvent(new CustomEvent('subdiagram-selected', {
      detail: {
        index: this.selectedIndex,
        value: this.options[this.selectedIndex].id
      },
      bubbles: true,
      composed: true
    }));
  }
  async firstUpdated() {
    this.options = this.configManager.get("subdiagramOptions") || [];
  }
  render() {
    return html`
            <div class="subdiagram-container">
              ${this.options?.map((option, index) => html`
                <button
                  class="subdiagram-btn ${index === this.selectedIndex ? 'active' : ''}"
                  @click=${() => this.handleToggle(index)}
                >
                  ${option.label}
                </button>
              `)}
            </div>
        `;
  }
}
