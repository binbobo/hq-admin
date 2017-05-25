import { Directive, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { SuspendBillDirective, SuspendBillService } from 'app/pages/chain/chain-shared';

@Directive({
  selector: '[hqSalesOutBill]'
})
export class SalesOutBillDirective extends SuspendBillDirective {

  constructor(
    service: SuspendBillService,
    viewContainerRef: ViewContainerRef,
    componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(service, viewContainerRef, componentFactoryResolver);
    this.type = "MS";
    this.columns = [
      { name: 'custName', title: '客户名称' },
      { name: 'custPhone', title: '手机号码' },
      { name: 'operator', title: '操作人' },
    ];
  }

}