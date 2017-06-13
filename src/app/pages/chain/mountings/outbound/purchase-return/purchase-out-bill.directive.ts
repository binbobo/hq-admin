import { Directive, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { SuspendBillDirective, SuspendBillService } from 'app/pages/chain/chain-shared';
import { PagedResult } from 'app/shared/models';
import { StandardDatetimePipe } from "app/shared/pipes";

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
    this.resultHandle = (result: PagedResult<any>) => {
      let pipe = new StandardDatetimePipe();
      if (result && Array.isArray(result.data)) {
        result.data.forEach(m => m['createBillTime'] = pipe.transform(m['createBillTime']));
      }
    };
  }
}
