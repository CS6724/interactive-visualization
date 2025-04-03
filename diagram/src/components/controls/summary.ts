import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('summary-tooltip')
export class SummaryTooltip extends LitElement {
  @property({ type: String }) summary = 'Tooltip content';
  @property({ type: String }) currentId = "";
  @property({ type: Boolean, reflect: true }) isVisible = false;

  static styles = css`
    :host {
      position: absolute;
      display: none;
      background: rgba(255, 255, 255, 0.95);
      color: rgba(0, 0, 0, 0.8);
      font-size: 14px;
      line-height: 1.4;
      padding: 12px 16px;
      border-radius: 8px;
      max-width: 280px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      opacity: 0;
      pointer-events: none;
      transform: translateY(-8px);
      transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
    }

    /* Ensure visibility is updated properly */
    :host([isVisible]) {
      display: block;
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }

    /* Tooltip text */
    .summary-text {
      margin: 0 0 8px 0;
      padding: 1em 1em 1em 1em;
      overflow: show;

    }

    /* Mobile - tooltip appears at the bottom */
    @media (max-width: 768px) {
      :host {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: calc(100% - 40px);
        max-width: 400px;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      }

      .tooltip-arrow {
        display: none;
      }
    }
  `;

  render() {
    return html`
      <div class="tooltip-content">
        <div class="tooltip-arrow"></div>
        <p class="summary-text">${this.summary}</p>
      </div>
    `;
  }
}