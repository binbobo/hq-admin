import { NgModule } from '@angular/core';
import { SharedModule } from "app/shared/shared.module";
import { InboundRoutingModule, routedComponents } from "./inbound.routing";
import { SalesReturnComponent } from './sales-return/sales-return.component';

@NgModule({
  imports: [
    SharedModule,
    InboundRoutingModule
  ],
  declarations: [routedComponents, SalesReturnComponent]
})
export class InboundModule { }
