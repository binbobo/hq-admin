import { Directive, ViewContainerRef, EventEmitter, Output, ComponentFactoryResolver } from '@angular/core';
import { HqAlerterComponent } from './hq-alerter.component';

@Directive({
  selector: '[hqAlerter]'
})
export class HqAlerter {

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(HqAlerterComponent);
    let componentRef = viewContainerRef.createComponent(componentFactory);
    let component = (<HqAlerterComponent>componentRef.instance);
    component.alerts = this.alerts;
    component.onShow.subscribe
  }

  private alerts: Array<Object> = [];
  private onShow = new EventEmitter();

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

  public clear() {
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