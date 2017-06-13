import { Directive, ViewContainerRef, ComponentFactoryResolver, ElementRef, Input, OnInit, OnChanges, SimpleChanges, ComponentRef } from '@angular/core';
import { PaymentShowComponent } from './payment-show.component';

@Directive({
  selector: '[hqPaymentShow]'
})
export class PaymentShowDirective implements OnInit, OnChanges{

   private componentRef: ComponentRef<PaymentShowComponent>;

  ngOnChanges(changes: SimpleChanges): void {
    if ('payment' in changes && this.componentRef) {
      this.componentRef.instance.payment = changes['payment'].currentValue;
    }
  }

  ngOnInit(): void {
    let factory = this.componentFactoryResolver.resolveComponentFactory<PaymentShowComponent>(PaymentShowComponent);
    let compnent = this.viewContainerRef.createComponent(factory);
    compnent.instance.payment = this.payment;
    let el = this.el.nativeElement as HTMLElement;
    el.appendChild(compnent.location.nativeElement);
  }

  @Input('hqPaymentShow')
  private payment: Array<any>;
  constructor(
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

}
