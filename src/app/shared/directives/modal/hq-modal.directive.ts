import { Directive, OnInit, Input, ElementRef, ViewContainerRef, ComponentFactoryResolver, ComponentRef, TemplateRef, Injector, Renderer } from '@angular/core';
import { HqModalComponent } from './hq-modal/hq-modal.component';
import { element } from 'protractor';
import { ModalDirective } from 'ngx-bootstrap';

@Directive({
  selector: '[hqModal]',
  exportAs: 'hq-modal'
})
export class HqModalDirective implements OnInit {

  @Input()
  public config: any;
  @Input("modalTitle")
  public title: string;
  @Input()
  public size: string;
  private modal: ModalDirective;
  private componentRef: ComponentRef<HqModalComponent>;

  ngOnInit(): void {
    let resolver = this.componentFactoryResolver.resolveComponentFactory<HqModalComponent>(HqModalComponent);
    let element = this.el.nativeElement as HTMLElement;
    let nodes = Array.from(element.childNodes);
    this.componentRef = this.viewContainerRef.createComponent<HqModalComponent>(resolver, 0, this.injector, [nodes]);
    this.modal = this.componentRef.instance.modal;
  }

  public show() {
    this.componentRef.instance.config = this.config;
    this.componentRef.instance.title = this.title;
    this.componentRef.instance.size = this.size;
    this.modal.show();
    setTimeout(() => this.modal.show(), 100);
  }

  public hide() {
    this.modal.hide();
  }

  public get isShown() {
    return this.modal.isShown;
  }

  constructor(
    private el: ElementRef,
    private injector: Injector,
    private render: Renderer,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {

  }

}

