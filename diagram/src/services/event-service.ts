import 'reflect-metadata';
import Container, { Inject, Service } from 'typedi';
import { DiagramType, UMLClassDiagram, UMLDiagram } from '../data-model';
import { DataService } from './data-service';
import { Breadcrumb } from '../components/controls';
import { Graph } from '@maxgraph/core';
import { IVLaPEvents } from '../types';
import { ConfigManager } from './configuration-manager';

@Service()
export class EventsService {
  /**
   * A dictionary of event types to arrays of event listeners. Provides a simple 
   * publish-subscribe mechanism for changes in the service.
   */
  private events: { [key: string]: Function[] } = {};

  constructor() {
    
  }

  
  /**
   * Subscribes a listener function to a specific event.
   *
   * @param event - The name of the event to listen for (e.g., `GRAPH_CHANGE`, `DIAGRAM_CHANGE`).
   * @param listener - The callback function to invoke when the event is emitted.
   *
   * @example
   * ```ts
   * storageService.on(IVLaPEvents.DIAGRAM_CHANGE, (diagram) => {
   *   console.log('Diagram changed:', diagram);
   * });
   * ```
   */
  public on(event: IVLaPEvents, listener: Function): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  /**
   * Unsubscribes a previously registered listener function from a specific event.
   *
   * @param event - The name of the event to stop listening to.
   * @param listener - The callback function to remove from the event's listener list.
   */
  public off(event: IVLaPEvents, listener: Function): void {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(l => l !== listener);
  }

  /**
   * Emits (triggers) a specified event with optional arguments to pass to each subscribed listener.
   *
   * @param event - The name of the event to emit.
   * @param args - Additional arguments to pass to each listener.
   *
   * @example
   * ```ts
   * storageService.emit(IVLaPEvents.DIAGRAM_CHANGE, currentDiagram);
   * ```
   */
  public emit(event: IVLaPEvents, ...args: any[]): void {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(...args));
  }
}