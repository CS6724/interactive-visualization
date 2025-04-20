import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { EventsService } from '../../services';
import Container from 'typedi';
import { IVLaPEvents } from '../../types';

@customElement('history-control')
export class HistoryControl extends LitElement {
    private eventsService:EventsService;
    @property({ type: Array }) branches = [
      {
        name: 'main',
        commits: [
          '0-86b11d1',
          '2-6e291c3',
          '4-a36bbe6',
          '6-6850e62',
          '9-kadsfcs',
          '1-9d9c9x1',
          '2-98xcank',
          '4-dx9dfnd',
        ],
      },
      {
        name: 'develop',
        commits: [
          '1-d5e2f1a',
          '3-a7c8bb3',
          '5-7782cfe',
          '7-ff9d234',
        ],
      },
      {
        name: 'release',
        commits: [
          'r1-a1b2c3d',
          'r2-d4e5f6g',
          'r3-h7i8j9k',
          'r4-asdasfa',
          'r5-l0m1n2o',
          'r6-0238cdj',
          'r7-jkasdda',
          'r8-akl2433',
          'r9-as092ds',
        ],
      },
    ];
    @state() selectedBranchIndex = 0;
    @state() currentIndex = 0;

    @state() isEnabled = true;

    static styles = css`
      :host {
        display: block;
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
      }

      .control-container {
        display: flex;
        align-items: center;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        padding: 8px;
        color: rgba(0, 0, 0, 0.7);
        font-weight:400;
        gap: 12px;
        width: fit-content;
        border: 1px solid var(--vscode-editorWidget-border, #c3c3c3);
      }

      select.branch-selector {
        padding: 4px 6px;
        border-radius: 4px;
        font-size: 12px;
        background-color: rgba(250, 250, 250, 0.8);
        color: rgb(110, 72, 170);
        border: 1px solid var(--vscode-editorWidget-border, #c3c3c3);
      }

      .pagination {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .commit-button {
        background-color: transparent;
        border: none;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #ccc;
      }

      .commit-button input[type="radio"] {
        appearance: none;
        width: 16px;
        height: 16px;
        border: 1px solid #3498db;
        border-radius: 50%;
        position: relative;
        transition: border-color 0.2s;
      }

      .commit-button input[type="radio"]:checked::before {
        content: "";
        position: absolute;
        top: 3px;
        left: 3px;
        width: 8px;
        height: 8px;
        background-color: #007acc;
        border-radius: 50%;
      }

      .commit-button input[type="radio"]:hover {
        border-color: #007acc;
      }

      .commit-id {
        font-size: 9px;
        margin-bottom: 4px;
        color: #3498db;
      }

      .nav-btn {
        border: none;
        background: #3498db;
        color: #fff;
        border-radius: 4px;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 12px;
        transition: background 0.2s;
      }

      .nav-btn:hover {
        background: #007acc;
      }
    `;

    constructor() {
      super();
      this.eventsService = Container.get(EventsService);
      this.eventsService.on(IVLaPEvents.CONTROL_OPTION_CHANGE, (data) => { 
            if(data.id == "history"){
              this.isEnabled = data.value;
              this.requestUpdate();
            }
          });
    }
    get currentBranch() {
      return this.branches[this.selectedBranchIndex]?.commits || [];
    }

    handleBranchChange(e) {
      this.selectedBranchIndex = e.target.selectedIndex;
      this.currentIndex = 0;
    }

    handleSelect(index) {
      this.currentIndex = index;
    }

    handlePrev() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    }

    handleNext() {
      if (this.currentIndex < this.currentBranch.length - 1) {
        this.currentIndex++;
      }
    }

    render() {
      const commits = this.currentBranch;
      const sideCount = 2;
      const start = Math.max(0, this.currentIndex - sideCount);
      const end = Math.min(commits.length, this.currentIndex + sideCount + 1);

      return html`
        <div class="control-container" style="display: ${this.isEnabled ? 'flex' : 'none'}">
          <select class="branch-selector" @change=${this.handleBranchChange}>
            ${this.branches.map(
              (branch) => html`<option>${branch.name} - ${branch.commits.length}</option>`
            )}
          </select>

          <div class="pagination">
            <button class="nav-btn" @click=${this.handlePrev}>Prev</button>
            ${commits.slice(start, end).map(
              (commit, index) => {
                const actualIndex = start + index;
                return html`
                  <button
                    class="commit-button"
                    @click=${() => this.handleSelect(actualIndex)}
                  >
                    <span class="commit-id">${commit.slice(0, 5)}</span>
                    <input
                      type="radio"
                      name="commit"
                      ?checked=${actualIndex === this.currentIndex}
                    />
                  </button>
                `;
              }
            )}
            <button class="nav-btn" @click=${this.handleNext}>Next</button>
          </div>
        </div>
      `;
    }
}