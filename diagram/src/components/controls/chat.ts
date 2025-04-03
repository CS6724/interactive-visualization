import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ChatService, EventsService, StorageService } from '../../services';
import Container from 'typedi';
import { IVLaPEvents } from '../../types';

///TODO: Split into service and component
///TODO: Fetch the FAQ on load
@customElement('chat-control')
export class ChatControl extends LitElement {
  
  @property({ type: String,  attribute: 'max-reconnect-attempts'  })
  maxReconnectAttempts = 5;
  
  @property({ type: String,  attribute: true  })
  server = '';

  @property({type: Array})
  context = [];

  @state()
  private messages = [];

  @state()
  private isThinking = false;

  @state()
  private isPopupOpen = false;

  @state()
  private isMinimized = true;

  @state()
  private expandedCategories = new Set();

  @state()
  private reconnectAttempts = 0;

  @state()
  private socket = null;

  @state()
  private inputValue = '';

  private eventsService: EventsService;
  private chatService: ChatService;
  private storageService:StorageService;
  
  // FAQ Data Structure - Customize as needed
  private faqData = {
    "General": [
      "What is IVLaP?",
      "How do I get started with this tool?",
      "Where can I find documentation?",
      "What are the system requirements?"
    ],
    "Feature Questions": [
      "How do I connect to a database?",
      "Can I export my conversation history?",
      "Is there a way to save my progress?",
      "How do I share my project with others?"
    ],
    "Troubleshooting": [
      "Why is my connection failing?",
      "How do I reset my workspace?",
      "I'm getting an error message, what should I do?",
      "The interface is not responding, how can I fix it?"
    ],
    "Advanced": [
      "How do I use custom templates?",
      "Can I integrate with other tools?",
      "How do I set up API access?",
      "What are the performance optimization tips?"
    ]
  };

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: transparent;
      overflow: hidden;
    }
    * {
      box-sizing: border-box;
    }
    #chat-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: transparent;
      overflow: hidden;
    }
    #context-info {
      font-size: 14px;
      color: var(--vscode-editor-foreground, #cccccc);
      padding: 12px 16px;
      background: var(--vscode-editorWidget-background, #252526);
      border-bottom: 1px solid var(--vscode-editorWidget-border, #3c3c3c);
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
    }
    #context-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    #context-title {
      margin: 0;
      padding: 0;
      font-size: 1.1rem;
      font-weight: bold;
      color: var(--vscode-editorWidget-foreground, #e7e7e7);
      display: flex;
      align-items: center;
    }
    #context-title svg {
      margin-right: 8px;
      width: 18px;
      height: 18px;
    }
    #context-content {
      border-radius: 6px;
      background: var(--vscode-editor-background, #1e1e1e);
      padding: 10px 12px;
      margin-bottom: 5px;
      border-left: 3px solid var(--vscode-activityBarBadge-background, #007acc);
    }
    .context-items {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .context-item {
      display: flex;
      align-items: center;
      background: var(--vscode-badge-background, #4d4d4d);
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 0.9rem;
    }
    .context-item-type {
      font-weight: bold;
      margin-right: 5px;
      color: var(--vscode-activityBarBadge-background, #007acc);
    }
    .context-item-id {
      color: var(--vscode-badge-foreground, #ffffff);
    }
    .context-actions {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .context-action-button {
      background: transparent;
      border: none;
      color: var(--vscode-textLink-foreground, #3794ff);
      cursor: pointer;
      font-size: 0.85rem;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background 0.2s ease;
      margin-left: 8px;
    }
    .context-action-button:hover {
      background: var(--vscode-button-secondaryHoverBackground, #2a2d2e);
      text-decoration: underline;
    }
    #chat-box {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      scroll-behavior: smooth;
    }
    #chat-box.minimized {
      flex: 0;
      height: 0;
      padding: 0;
      overflow: hidden;
      border: none;
      margin: 0;
      visibility: hidden;
    }
    .chat-bubble {
      max-width: 70%;
      padding: 10px;
      margin: 5px;
      border-radius: 15px;
      display: flex;
      align-items: flex-start;
      word-wrap: break-word;
      animation: fadeIn 0.3s ease-in-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .user {
      align-self: flex-end;
      background: #0078FF;
      color: white;
    }
    .bot {
      align-self: flex-start;
      background: #E5E5EA;
      color: black;
    }
    .chat-bubble .avatar {
      width: 30px;
      height: 30px;
      min-width: 30px;
      margin-right: 10px;
      background-size: contain;
      background-repeat: no-repeat;
    }
    .bot .avatar {
      background-image: url('data:image/svg+xml;utf8,<svg fill="%23000000" width="30" height="30" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M26,20H21V18h1a2.0023,2.0023,0,0,0,2-2V12h2V10H24V8a2.0023,2.0023,0,0,0-2-2H20V2H18V6H14V2H12V6H10A2.0023,2.0023,0,0,0,8,8v2H6v2H8v4a2.0023,2.0023,0,0,0,2,2h1v2H6a2.0023,2.0023,0,0,0-2,2v8H6V22H26v8h2V22A2.0023,2.0023,0,0,0,26,20ZM10,8H22v8H10Zm3,10h6v2H13Z"></path></svg>');
    }
    .user .avatar {
      background-image: url('data:image/svg+xml;utf8,<svg fill="%23FFFFFF" width="30" height="30" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16,8a5,5,0,1,0,5,5A5,5,0,0,0,16,8Z M16,16a3,3,0,1,1,3-3A3.0034,3.0034,0,0,1,16,16Z M16,2A14,14,0,1,0,30,16,14.0158,14.0158,0,0,0,16,2ZM10,26.3765V25a3.0033,3.0033,0,0,1,3-3h6a3.0033,3.0033,0,0,1,3,3v1.3765a11.8989,11.8989,0,0,1-12,0Zm13.9925-2.4017A5.0016,5.0016,0,0,0,19,19H13a5.0016,5.0016,0,0,0-4.9925,4.9748,12,12,0,1,1,15.985,0Z"></path></svg>');
    }
    #input-container {
      display: flex;
      align-items: flex-end; /* Aligns items to the baseline */
      padding: 10px;
      background: var(--vscode-editor-background, #1e1e1e);
      border-top: 1px solid var(--vscode-editorWidget-border, #3c3c3c);
      position: relative;
    }
    .input-wrapper {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
    }
    #user-input {
      flex: 1;
      padding: 8px 8px 8px 40px;
      border: 1px solid var(--vscode-input-border, #3c3c3c);
      border-radius: 4px;
      background: var(--vscode-input-background, #252526);
      color: var(--vscode-input-foreground, #ffffff);
      resize: none;
      min-height: 36px;
      max-height: 150px;
      overflow-y: auto;
      font-family: inherit;
      line-height: 1.5;
    }
    #user-input:focus {
      outline: none;
      border-color: var(--vscode-focusBorder, #007acc);
    }
    @keyframes dot-animation {
      0% { content: ''; }
      25% { content: '.'; }
      50% { content: '..'; }
      75% { content: '...'; }
      100% { content: ''; }
    }
    .thinking-text::after {
      content: '';
      display: inline-block;
      animation: dot-animation 1.5s infinite;
    }
    button {
      margin-left: 10px;
      padding: 8px 12px;
      border: 1px solid var(--vscode-button-border, #3c3c3c);
      background: var(--vscode-button-background, #007acc);
      color: var(--vscode-button-foreground, #ffffff);
      cursor: pointer;
      border-radius: 4px;
      transition: background 0.2s ease-in-out;
      align-self: flex-end;
    }
    button:hover {
      background: var(--vscode-button-hoverBackground, #005f9e);
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .error-message {
      color: #ff4444;
      padding: 10px;
      text-align: center;
      animation: fadeIn 0.3s ease-in-out;
    }
    
    /* FAQ Popup Styles */
    #faq-button {
      position: absolute;
      left: 10px;
      bottom:-0.5em;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: var(--vscode-button-background, #007acc);
      cursor: pointer;
      z-index: 100;
      margin-left: 0;
      padding: 0;
      flex-shrink: 0;
      align-self: flex-end;
    }
    
    #faq-button:hover {
      color: var(--vscode-button-foreground, #ffffff);
      background: transparent;
      
    }
    
    #collapse-button {
      margin-left: 10px;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #collapse-button svg {
      width: 16px;
      height: 16px;
    }
    
    #faq-popup {
      position: absolute;
      bottom: 80px;
      left: 10px;
      width: calc(100% - 20px);
      max-height: 300px;
      background: var(--vscode-editorWidget-background, #252526);
      border: 1px solid var(--vscode-editorWidget-border, #3c3c3c);
      border-radius: 8px;
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 10;
      animation: slideUp 0.3s ease-in-out;
    }
    #faq-popup.open {
      display: flex;
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    #faq-content {
      overflow-y: auto;
      padding: 0;
      max-height: 300px;
    }
    
    .faq-category-header {
      padding: 12px 15px;
      background: var(--vscode-editorWidget-background, #2d2d2d);
      color: var(--vscode-editor-foreground, #cccccc);
      cursor: pointer;
      font-weight: bold;
      border-bottom: 1px solid var(--vscode-editorWidget-border, #3c3c3c);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .faq-category-header:hover {
      background: var(--vscode-list-hoverBackground, #2a2d2e);
    }
    
    .faq-category-items {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease-out;
    }
    
    .faq-category-items.expanded {
      max-height: 500px;
      transition: max-height 0.5s ease-in;
    }
    
    .faq-item {
      padding: 10px 15px 10px 25px;
      border-bottom: 1px solid var(--vscode-editorWidget-border, #3c3c3c);
      cursor: pointer;
      transition: background 0.2s;
      color: var(--vscode-editor-foreground, #cccccc);
    }
    
    .faq-item:hover {
      background: var(--vscode-list-hoverBackground, #2a2d2e);
    }
    
    .faq-item:last-child {
      border-bottom: none;
    }
    
    .toggle-icon {
      font-size: 14px;
      margin-right: 5px;
    }
                /* Chat sidebar styles */
          .chat-sidebar {
            position: fixed;
            top: 4em;
            right: 1em;
            height: 90vh;
            max-width: 320px;
            background-color: white;
            box-shadow: -2px 0 10px rgba(0,0,0,0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            visibility: hidden;
      
          }
          
          .chat-sidebar.open {
            transform: translateX(0);
            visibility: visible;
          }
          
          .chat-toggle-btn {
            position: fixed;
            bottom: 20px;
            right: -1px;
            background-color: #3498db;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px 0 0 4px;
            cursor: pointer;
            z-index: 1001;
            box-shadow: -2px 0 5px rgba(0,0,0,0.1);
          }
          
          .chat-header {
            padding: 12px 15px;
            background-color: #3498db;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
          }
          .chat-header button {
            background: transparent;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
            padding: 5px;
            transition: 0.2s ease-in-out;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            border-radius: 50%;
          }

          .chat-header button:hover {
            background-color: rgba(255, 255, 255, 0.2);
          }

          /* Ensure they are aligned properly */
          .chat-close-btn {
            font-size: 20px;
            margin-left: 4px;
          }
          .chat-minimize-btn {
            font-size: 20px;
            margin-left: auto;
          }
          .chat-close-btn, .chat-minimize-btn {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
      
          }
          .chat-minimize-btn {
            margin-left: auto;
            }
          .chat-content {
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }
  `;

  constructor() {
    super();
    this.context = [];
    this.maxReconnectAttempts = 5;
    this.storageService= Container.get(StorageService);
    this.eventsService= Container.get(EventsService);
    this.chatService= Container.get(ChatService);
    this.eventsService.on(IVLaPEvents.CHAT_EVENT, (data)=>{this.handleResponse(data)});
  }

  public toggleContext(newcontext: {id: string, type: string}) {
    if(!this.context.find((c) => c.id == newcontext.id)) {
      this.context.push(newcontext);  
    }else {
      this.context = this.context.filter((c) => c.id != newcontext.id);
    }
    this.requestUpdate();
  }
  public clearContext() {
    this.context = []
    this.requestUpdate();
    this.dispatchEvent(new CustomEvent('clear-selection', {
      detail: {},
      bubbles: true,
      composed: true
    }));
  }
  
  get chatContext() {
    let contextString = "This chat is contextualized for the following: \n";
    this.context.forEach((c) => {
      contextString += c.type + " : " + c.id + "  \n";
    });
    return contextString;
  }
  
  connectedCallback() {
    super.connectedCallback();
    this.connectWebSocket();
    
    // Listen for external messages (e.g., from VSCode)
    window.addEventListener('message', this._handleExternalMessages.bind(this));
    
    // Close FAQ popup when clicking outside
    document.addEventListener('click', this._handleOutsideClick.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.socket) {
      this.socket.close();
    }
    window.removeEventListener('message', this._handleExternalMessages);
    document.removeEventListener('click', this._handleOutsideClick);
  }

  _handleOutsideClick(event) {
    // We need to check if the event target is inside the shadow DOM
    const path = event.composedPath();
    const faqButton = this.shadowRoot.getElementById('faq-button');
    const faqPopup = this.shadowRoot.getElementById('faq-popup');
    
    // Only close if popup is open and click is outside both button and popup
    if (this.isPopupOpen && 
        !path.includes(faqButton) && 
        !path.includes(faqPopup)) {
      this.isPopupOpen = false;
      this.requestUpdate();
    }
  }

  _handleExternalMessages(event) {
    const message = event.data;
    if (message.command === 'updateChat') {
      this.requestUpdate();
    }
  }

  async connectWebSocket() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.showError("Unable to establish connection. Please refresh the page.");
      return;
    }
    try {
      this.socket = new WebSocket("ws://52.87.226.95:8000/ws");
      
      this.socket.onopen = () => {
        console.log("WebSocket connected!");
        this.reconnectAttempts = 0;
      };

      this.socket.onclose = async () => {
        console.log("WebSocket closed. Attempting to reconnect...");
        this.reconnectAttempts++;
        await new Promise(resolve => setTimeout(resolve, 1000 * this.reconnectAttempts));
        this.connectWebSocket();
      };

      this.socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      
      this.socket.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          const response = msg.final_response || msg.assistant_response;
          if (response) {
            this.addBotMessage(response);
          }
        } catch (error) {
          console.error("Message parsing error:", error);
          this.showError("Error processing response");
        }
      };
    } catch (error) {
      console.error("Connection error:", error);
      this.showError("Failed to connect to server");
    }
  }

  addUserMessage(message) {
    this.messages = [...this.messages, { type: 'user', content: message }];
    this.scrollToBottom();
  }

  addBotMessage(message) {
    this.isThinking = false;
    this.messages = [...this.messages, { type: 'bot', content: message }];
    this.scrollToBottom();
  }

  showError(message) {
    const errorMsg = { type: 'error', content: message };
    this.messages = [...this.messages, errorMsg];
    this.scrollToBottom();
    
    // Remove error after 5 seconds
    setTimeout(() => {
      this.messages = this.messages.filter(msg => msg !== errorMsg);
      this.requestUpdate(); // Ensure UI updates after removing the message
    }, 5000);
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatBox = this.shadowRoot.getElementById('chat-box');
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }, 0);
  }
  handleSendMessage() {
    this.isThinking = true;
    const message = this.inputValue.trim();
    if (!message) return;
    this.chatService.sendMessage(message);
    this.addUserMessage(message);
    this.inputValue = '';
  }
  handleResponse(data){
    this.isThinking = false;
    if(data.message){
      this.addBotMessage(data.message)
    }
    if (data.diagram_data) {
      this.storageService.setCurrentDiagram(data.diagram_data)
    }
    }
  handleSendMessage2() {
    const message = this.inputValue.trim();
    
    if (!message) return;

    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.showError("Connection lost. Attempting to reconnect...");
      this.connectWebSocket();
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    }

    // Add user message to chat
    this.addUserMessage(message);
    
    // Reset textarea height
    this.adjustTextareaHeight();
    
    try {
      this.socket.send(JSON.stringify({ "message": message, "context": this.context }));
      this.isThinking = true;
    } catch (error) {
      this.showError("Failed to send message. Please try again.");
      console.error("Send error:", error);
    }
  }

  handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.handleSendMessage();
    }
  }

  handleInputChange(e) {
    this.inputValue = e.target.value;
    this.adjustTextareaHeight();
  }
  
  adjustTextareaHeight() {
    setTimeout(() => {
      const textarea = this.shadowRoot.getElementById('user-input');
      if (textarea) {
        // Reset height first to get the correct scrollHeight
        textarea.style.height = 'auto';
        // Set the height based on content, with a max height
        const newHeight = Math.min(textarea.scrollHeight, 150);
        textarea.style.height = `${newHeight}px`;
      }
    }, 0);
  }

  toggleFAQPopup(e) {
    // Prevent event from propagating to document
    if (e) {
      e.stopPropagation();
    }
    
    this.isPopupOpen = !this.isPopupOpen;
    this.requestUpdate(); // Ensure the UI updates
  }
  toggleChat() {
    
    this.isMinimized = !this.isMinimized;
    this.requestUpdate();
  }
  
  toggleCategory(category, e) {
    if (e) {
      e.stopPropagation();
    }
    
    if (this.expandedCategories.has(category)) {
      this.expandedCategories.delete(category);
    } else {
      this.expandedCategories.add(category);
    }
    
    this.requestUpdate();
  }

  selectFAQItem(question, e) {
    if (e) {
      e.stopPropagation();
    }
    this.inputValue = question;
    this.isPopupOpen = false;
    this.requestUpdate();
    
    // Focus the input after a short delay
    setTimeout(() => {
      const input = this.shadowRoot.getElementById('user-input');
      if (input) {
        input.focus();
      }
    }, 100);
  }

  renderChatMessages() {
    return this.messages.map((message, index) => {
      if (message.type === 'error') {
        return html`<div class="error-message">${message.content}</div>`;
      }
      
      return html`
        <div class="chat-bubble ${message.type}">
          <div class="avatar"></div>
          <div class="content">${message.content}</div>
        </div>
      `;
    });
  }

  renderFAQCategories() {
    return Object.entries(this.faqData).map(([category, questions]) => {
      const isExpanded = this.expandedCategories.has(category);
      
      return html`
        <div class="faq-category">
          <div class="faq-category-header" @click=${(e) => this.toggleCategory(category, e)}>
            <span>${category}</span>
            <span class="toggle-icon">${isExpanded ? '▼' : '▶'}</span>
          </div>
          <div class="faq-category-items ${isExpanded ? 'expanded' : ''}">
            ${questions.map(question => html`
              <div class="faq-item" @click=${(e) => this.selectFAQItem(question, e)}>
                ${question}
              </div>
            `)}
          </div>
        </div>
      `;
    });
  }

  // Render context items as individual pills/badges
  renderContextItems() {
    return this.context.map(item => html`
      <div class="context-item">
        <span class="context-item-type">${item.type}:</span>
        <span class="context-item-id">${item.id}</span>
      </div>
    `);
  }

  get hasContext() {
    return this.context.length > 0;
  }

  firstUpdated() {
    // Initialize textarea height
    this.adjustTextareaHeight();
  }


  public openChat(context?: any) {
    this.isMinimized = false;
    this.toggleContext(context);
    this.requestUpdate()
    // this.toggleSelection(`#${CSS.escape(context.id)}`);
  }
 
  public closeChat() {
    this.dispatchEvent(new CustomEvent('clear-selection', {
      detail: {},
      bubbles: true,
      composed: true
    }));
    this.clearContext();
    this.toggeChat();
  }
  
  public toggeChat(){
    this.isMinimized = !this.isMinimized;
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="chat-sidebar ${!this.isMinimized ? 'open' : ''}">
        <div class="chat-header">
          <span>Ask IVLaP</span>
          <button class="chat-minimize-btn" @click="${() => this.toggleChat()}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="chat-close-btn" @click="${() => this.closeChat()}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6l12 12m0-12L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="chat-content">
          <div id="chat-container"> ${this.hasContext ? html`
            <div id="context-info">
              <div id="context-header">
                <div id="context-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
                  </svg> Conversation Context
                </div>
                <div class="context-actions">
                  <button class="context-action-button" @click=${this.clearContext}>Clear All</button>
                </div>
              </div>
              <div id="context-content">
                <div class="context-items"> ${this.renderContextItems()} </div>
              </div>
            </div> ` : ''}
            <div id="chat-box" class="${this.isMinimized ? 'minimized' : ''}"> 
              ${this.renderChatMessages()}
              ${this.isThinking ? html`
                <div class="chat-bubble bot">
                  <div class="avatar"></div>
                  <div class="content"><i class="thinking-text">Thinking</i></div>
                </div> ` : ''}
            </div>
            <div id="input-container" class="${this.isMinimized ? 'minimized' : ''}">
              <div class="input-wrapper">
                <button id="faq-button" title="Suggested Questions" @click=${(e) => this.toggleFAQPopup(e)}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                    <path d="M12 8C13.1 8 14 8.9 14 10C14 10.74 13.64 11.38 13.09 11.73L12.5 12.12C11.84 12.58 11.5 13.37 11.5 14V14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="12" cy="17" r="1" fill="currentColor"/>
                  </svg>
                </button>
        
                <textarea id="user-input"  placeholder="Type a message..."  rows="1" .value=${this.inputValue} @input=${this.handleInputChange} @keypress=${this.handleKeyPress}></textarea>
              </div>
      
              <button id="send-btn" @click=${this.handleSendMessage}>Send</button>
              <div id="faq-popup" class="${this.isPopupOpen ? 'open' : ''}">
                <div id="faq-content"> ${this.renderFAQCategories()} </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Chat toggle button - only show when chat is closed -->
      ${this.isMinimized ? html`
        <button class="chat-toggle-btn" @click="${this.toggeChat}">
          <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
            <path d="M3 20V6C3 4.9 3.9 4 5 4H19C20.1 4 21 4.9 21 6V16C21 17.1 20.1 18 19 18H7L3 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>`:""}
      `;
  }
}