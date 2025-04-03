import { Cell } from '@maxgraph/core';

export class UMLElement extends Cell{
    private events: { [key: string]: Function[] } = {};

    constructor(public html){
        super(html)

    }
    // Subscribe to an event
    on(event: string, listener: Function): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    // Unsubscribe from an event
    off(event: string, listener: Function): void {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(l => l !== listener);
    }

    // Emit (trigger) an event
    emit(event: string, ...args: any[]): void {
        if (!this.events[event]) return;
        this.events[event].forEach(listener => listener(...args));
    }

} 