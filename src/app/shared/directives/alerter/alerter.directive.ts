import { Directive, ViewContainerRef, EventEmitter, Output, ComponentFactoryResolver, ElementRef } from '@angular/core';
import { HqAlerterComponent } from './alerter.component';

@Directive({
  selector: '[hq-alerter]',
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
    component.onShow = this.onShow;
  }

  private alerts: Array<Object> = [];
  private onShow = new EventEmitter();

  private show(msg: string, type: AlerterType, dismissible: boolean = false, dismissOnTimeout: number = 3000): ClosableAlerter {
    var alertType = type || AlerterType.Info;
    var model = {
      msg: msg,
      type: AlerterType[alertType].toLowerCase(),
      dismissible: dismissible === false ? null : dismissible,
      dismissOnTimeout: dismissOnTimeout === 0 ? null : (dismissOnTimeout || 3000),
      onClose: null
    };
    this.alerts.push(model);
    setTimeout(() => this.onShow.emit(), 100);
    return new ClosableAlerter(model);
  }
  /**
   * 显示警告消息
   * @param msg 消息内容
   * @param dismissible 是否允许可关闭，默认false 
   * @param dismissOnTimeout 显示时间，单位毫秒，为0时一直显示，默认3000
   */
  public warn(msg: string, dismissible: boolean = false, dismissOnTimeout: number = 3000): ClosableAlerter {
    console.warn(msg);
    return this.show(msg, AlerterType.Warning, dismissible, dismissOnTimeout);
  }
  /**
   * 显示提示消息
   * @param msg 消息内容
   * @param dismissible 是否允许可关闭，默认false 
   * @param dismissOnTimeout 显示时间，单位毫秒，为0时一直显示，默认3000
   */
  public info(msg: string, dismissible: boolean = false, dismissOnTimeout: number = 3000): ClosableAlerter {
    console.info(msg);
    return this.show(msg, AlerterType.Info, dismissible, dismissOnTimeout);
  }
  /**
   * 显示成功消息
   * @param msg 消息内容
   * @param dismissible 是否允许可关闭，默认false 
   * @param dismissOnTimeout 显示时间，单位毫秒，为0时一直显示，默认3000
   */
  public success(msg: string, dismissible: boolean = false, dismissOnTimeout: number = 3000): ClosableAlerter {
    console.log(msg);
    return this.show(msg, AlerterType.Success, dismissible, dismissOnTimeout);
  }

  /**
   * 显示错误消息
   * @param msg 消息内容
   * @param dismissible 是否允许可关闭，默认true 
   * @param dismissOnTimeout 显示时间，单位毫秒，为0时一直显示，默认0
   */
  public error(msg: string, dismissible: boolean = false, dismissOnTimeout: number = 5000): ClosableAlerter {
    console.error(msg);
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