import { Directive, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { SuspendBillDirective, SuspendBillService } from 'app/pages/chain/chain-shared';

@Directive({
  selector: '[hqReceiveOutBill]'
})
export class ReceiveOutBillDirective extends SuspendBillDirective {

  constructor(
    service: SuspendBillService,
    viewContainerRef: ViewContainerRef,
    componentFactoryResolver: ComponentFactoryResolver
  ) {
    super(service, viewContainerRef, componentFactoryResolver);
    this.type = "IU";
    this.columns = [
      { name: 'reveiver', title: '领料人' },
      { name: 'department', title: '部门' },
    ];
  }

}