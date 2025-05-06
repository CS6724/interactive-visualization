import { customElement, state } from 'lit/decorators.js';
import { LitElement, html, css } from 'lit';
import { EventsService } from '../../services';
import Container from 'typedi';
import { IVLaPEvents } from '../../types';

@customElement('help-control')
export class HelpControl extends LitElement {
  @state()
  private isEnabled = true;
  @state()
  private onTour = false;

  private eventsService: EventsService;

  static styles = css`
    :host {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 1000;
      background-color: #007bff;
      border-radius: 15px;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
      overflow: hidden;
    }

    .help-btn {
      background: none;
      border: none;
      padding: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFF; /* Bootstrap blue or match your theme */
      transition: background-color 0.2s ease;
    }

    .help-btn:hover {
      background-color: rgba(0, 123, 255, 0.1); /* subtle blue background */
      border-radius: 4px;
    }

    .help-btn svg {
      width: 20px;
      height: 20px;
      stroke: #FFF;
      stroke-width: 2;
      fill: none;
    }

    .tour-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    .tour-modal-content {
      background: white;
      padding: 2em;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      width: 300px;
      text-align: center;
      font-family: 'Segoe UI', sans-serif;
    }

    .tour-modal-content h2 {
      margin-top: 0;
      font-size: 1.4em;
      margin-bottom: 0.5em;
    }

    .tour-modal-content button {
      margin: 0.5em;
      padding: 0.5em 1em;
      font-size: 14px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .tour-modal-content button:hover {
      background-color: #f0f0f0;
    }

    .tour-modal-content label {
      font-size: 0.9em;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 1em;
      color: #444;
    }
  `;

  constructor() {
    super();
    this.eventsService = Container.get(EventsService);

    this.eventsService.on(IVLaPEvents.CONTROL_OPTION_CHANGE, (data) => {
      if (data.id === 'tour') {
        this.isEnabled = data.value;
        this.requestUpdate();
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

  private _startTour() {
    this.eventsService.emit(IVLaPEvents.HELP_EVENT, { type: 'start', value: '' });
  }

  private _dismissTour() {
    const checkbox = this.shadowRoot?.querySelector('.dont-show-again') as HTMLInputElement;
    const dismissForever = checkbox?.checked;
    this.eventsService.emit(IVLaPEvents.HELP_EVENT, { type: 'dismiss', value: !dismissForever });
  }

  render() {
    return html`
      ${this.isEnabled? html`
        <!-- Modal for first-time users -->
        ${!sessionStorage.getItem('umlTourPromptDismissed') && !localStorage.getItem('umlTourDone') ? html`
          <div class="tour-modal" style="display: ${this.isEnabled && !this.onTour? 'flex' : 'none'}">
            <div class="tour-modal-content">
              <h2>Take a Quick Tour?</h2>
              <p>Would you like to explore the interface features?</p>
              <div>
                <button @click=${this._startTour}>Yes</button>
                <button @click=${this._dismissTour}>No</button>
              </div>
              <label>
                <input type="checkbox" class="dont-show-again"> Don’t show again
              </label>
            </div>
          </div>
        ` : null}

        <!-- Help icon button -->
        <button class="help-btn" @click=${this._startTour} title="Start tour">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 1 1 5.83 1c0 1.5-2 2-2 2"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>
      ` : null}
    `;
  }
}