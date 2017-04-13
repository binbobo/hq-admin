import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class EventDispatcher {

    constructor() { }

    private events: object = {};

    public emit(event: string, value?: any) {
        if (!event) return;
        if (this.events.hasOwnProperty(event)) {
            this.events[event].emit(value);
        }
    }

    public subscribe(event: string, generatorOrNext?: any, error?: any, complete?: any): any {
        if (!event) return;
        let emitter = this.events[event] || new EventEmitter<any>();
        let subscription = emitter.subscribe(generatorOrNext, error, complete);
        this.events[event] = emitter;
        return subscription
    }
}