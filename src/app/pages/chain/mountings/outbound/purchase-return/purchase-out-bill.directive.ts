import { Directive, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { SuspendBillDirective, SuspendBillService } from 'app/pages/chain/chain-shared';

@Directive({
  selector: '[hqPurchaseOutBill]'
})
export class PurchaseOutBillDirective extends SuspendBillDirective {

  constructor(
    service: SuspendBillService,
    viewContainerRef: ViewContainerRef,
    componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(service, viewContainerRef, componentFactoryResolver);
    this.type = "PO";
    this.columns = [
      { name: 'provider', title: '供应商' },
      { name: 'createBillTime', title: '挂单时间' },
    ];
  }
}
