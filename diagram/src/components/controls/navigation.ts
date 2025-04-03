import { customElement, state } from 'lit/decorators.js';
import { LitElement, html, css } from 'lit';
import { EventsService } from '../../services';
import Container from 'typedi';
import { IVLaPEvents } from '../../types';

@customElement('navigation-control')
export class NavigationControl extends LitElement {
    @state()
    private activeButton = null;

    private eventsService:EventsService;
    static styles = css`
      :host {
        display: block;
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 1000;
      }

      .controls-container {
        display: flex;
        background-color: #ffffff;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        overflow: hidden;
      }

      .nav-btn {
        border: none;
        background-color: transparent;
        padding: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s ease;
        color: #333;
      }

      .nav-btn:hover {
        background-color: #f5f5f5;
      }

      .nav-btn:active {
        background-color: #e0e0e0;
      }

      .nav-btn svg {
        width: 18px;
        height: 18px;
      }

      .divider {
        width: 1px;
        background-color: #e0e0e0;
      }

      .nav-btn.active > svg{
        fill:rgb(50, 121, 58);
      }
    `;

    constructor() {
      super();
      this.eventsService = Container.get(EventsService);
    }

    handleAction(action) {
      if (action === 'drag') {
        this.activeButton = this.activeButton === 'drag' ? null : 'drag';
      } else {
        this.activeButton = null;
      }

      this.eventsService.emit(IVLaPEvents.NAVIGATION_EVENT, {
        type: action
      })
      this.dispatchEvent(new CustomEvent('nav-action', {
        detail: { action },
        bubbles: true,
        composed: true
      }));
      
      console.log(`Action triggered: ${action}`);
    }

    render() {
      return html`
        <div class="controls-container">
          <!-- Back button -->
          <button class="nav-btn" @click=${() => this.handleAction('back')} title="Back">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
          </button>

          <!-- Forward button -->
          <button class="nav-btn" @click=${() => this.handleAction('forward')} title="Forward">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 1 1 -9 -9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
            </svg>
          </button>

          <div class="divider"></div>

          <!-- Stop button -->
          
          <!-- Disabled drag button for now
          <button 
            class="nav-btn ${this.activeButton === 'drag' ? 'active' : ''}" 
            @click=${() => this.handleAction('drag')} 
            title="Stop" >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 11V9.27308C17 8.75533 17.2588 8.27183 17.6896 7.98463L17.7388 7.95181C18.2041 7.64162 18.806 7.62565 19.287 7.91073V7.91073C19.729 8.17263 20 8.64824 20 9.16196L20 13C20 14.6997 19.4699 16.2756 18.5661 17.5714C17.1204 19.6439 14.7186 21 12 21C9.28145 21 6.8796 19.6439 5.43394 17.5714C4.53009 16.2756 4.00001 14.6997 4.00001 13L4.00001 12.2117C4 11.438 4.44632 10.7336 5.14599 10.4032V10.4032C5.6867 10.1479 6.3133 10.1479 6.85401 10.4032V10.4032C7.55368 10.7336 8 11.438 8.00001 12.2117L8.00001 13" stroke="#323232" stroke-width="2" stroke-linecap="round"></path> <path d="M8 12V5.80278C8 5.30125 8.25065 4.8329 8.66795 4.5547V4.5547C9.1718 4.2188 9.8282 4.2188 10.3321 4.5547V4.5547C10.7493 4.8329 11 5.30125 11 5.80278V11" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 11V5.80278C14 5.30125 14.2507 4.8329 14.6679 4.5547V4.5547C15.1718 4.2188 15.8282 4.2188 16.3321 4.5547V4.5547C16.7493 4.8329 17 5.30125 17 5.80278V9" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M11 6V4.80278C11 4.30125 11.2507 3.8329 11.6679 3.5547V3.5547C12.1718 3.2188 12.8282 3.2188 13.3321 3.5547V3.5547C13.7493 3.8329 14 4.30125 14 4.80278V6" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
          </button>
          <div class="divider"></div>
         
          End of drag buttong  -->
          
          
          <!-- Zoom out button -->
          <button class="nav-btn" @click=${() => this.handleAction('zoomOut')} title="Zoom Out">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </button>

          <!-- Reset button -->
          <button class="nav-btn" @click=${() => this.handleAction('reset')} title="Reset">
            Reset
          </button>

          <!-- Zoom in button -->
          <button class="nav-btn" @click=${() => this.handleAction('zoomIn')} title="Zoom In">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </button>
        </div>
      `;
    }
  }