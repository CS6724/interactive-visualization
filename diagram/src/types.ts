export enum IVLaPEvents {
  DIAGRAM_CHANGE = 'diagram-change',
  GRAPH_CHANGE = 'graph-change',
  CONFIG_CHANGE = "config-change",
  CHAT_EVENT = "chat",
  NAVIGATION_EVENT = "navigation",
  CONTROL_OPTION_CHANGE = "control-option-change",
  HELP_EVENT = "help_event"
}
export interface ChatEvent {
  type: 'human' | 'bot'
}

export interface NavigationEvent {
  type: 'drag' | 'zoomIn' | 'zoomOut' | 'reset' | 'forward' | 'back'
}