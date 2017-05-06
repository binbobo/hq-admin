import { NgModule } from '@angular/core';
import { SharedModule } from "app/shared/shared.module";
import { MountingsRoutingModule, routedComponents } from "./mountings.routing";
import { PriceCheckService } from './price-check/price-check.service';
import { MountingsService } from './mountings.service';
import { StockListCreateService } from './take-stock/stock-list-create/stock-list-create.service';
import { SuspendedBillsService } from './suspended-bills.service';

@NgModule({
  imports: [
    SharedModule,
    MountingsRoutingModule
  ],
  providers: [PriceCheckService, MountingsService, SuspendedBillsService, StockListCreateService],
  declarations: [routedComponents]
})
export class MountingsModule { }
