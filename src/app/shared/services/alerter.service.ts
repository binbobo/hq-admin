import { Injectable, EventEmitter } from '@angular/core';

export class AlerterService {
    public alerts: Array<Object> = [];
    public onShow = new EventEmitter();
    constructor() { }
    private show(msg: string, type?: AlerterType, dismissible?: boolean, dismissOnTimeout?: number): ClosableAlerter {
        var alertType = type || AlerterType.Info;
        var model = {
            msg: msg,
            type: AlerterType[alertType].toLowerCase(),
            dismissible: dismissible === false ? null : dismissible,
            dismissOnTimeout: dismissOnTimeout === 0 ? null : (dismissOnTimeout || 3000),
            onClose: null
        };
        this.alerts.push(model);
        this.onShow.emit();
        return new ClosableAlerter(model);
    }

    public warn(msg: string, dismissible?: boolean, dismissOnTimeout?: number): ClosableAlerter {
        return this.show(msg, AlerterType.Warning, dismissible, dismissOnTimeout);
    }

    public info(msg: string, dismissible?: boolean, dismissOnTimeout?: number): ClosableAlerter {
        return this.show(msg, AlerterType.Info, dismissible, dismissOnTimeout);
    }

    public success(msg: string, dismissible?: boolean, dismissOnTimeout?: number): ClosableAlerter {
        return this.show(msg, AlerterType.Success, dismissible, dismissOnTimeout);
    }

    public error(msg: string, dismissible?: boolean, dismissOnTimeout?: number): ClosableAlerter {
        return this.show(msg, AlerterType.Danger, dismissible, dismissOnTimeout);
    }

    public clear(): AlerterService {
        this.alerts = [];
        return this;
    }
}

export enum AlerterType {
    Info = 0,
    Success = 1,
    Warning = 2,
    Danger = 3
}

export class ClosableAlerter {
    constructor(public model: any) { }
    public onClose(generatorOrNext?: any, error?: any, complete?: any) {
        let event = new EventEmitter<void>();
        event.subscribe(generatorOrNext, error, complete);
        this.model.onClose = event;
    }
}