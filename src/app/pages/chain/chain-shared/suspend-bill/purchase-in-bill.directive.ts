import { Directive, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { SuspendBillDirective } from './suspend-bill.directive';
import { SuspendBillService } from './suspend-bill.service';

@Directive({
  selector: '[hqPurchaseInBill]'
})
export class PurchaseInBillDirective extends SuspendBillDirective {

  constructor(
    service: SuspendBillService,
    viewContainerRef: ViewContainerRef,
    componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(service, viewContainerRef, componentFactoryResolver);
    this.type = "PI";
    this.columns = [
      { name: 'custName', title: '供应商' },
      { name: 'createBillTime', title: '挂单时间' },
    ];
  }

}
