import { NgModule } from '@angular/core';
import { SharedModule } from "app/shared/shared.module";
import { MountingsRoutingModule, routedComponents } from "./mountings.routing";
import { PriceCheckService } from './price-check/price-check.service';
import { MountingsService } from './mountings.service';
import { StockListCreateService } from './take-stock/stock-list-create/stock-list-create.service';
import { NgPipesModule } from 'ngx-pipes';

@NgModule({
  imports: [
    SharedModule,
    NgPipesModule,
    MountingsRoutingModule,
  ],
  providers: [PriceCheckService, MountingsService, StockListCreateService],
  declarations: [routedComponents]
})
export class MountingsModule { }
