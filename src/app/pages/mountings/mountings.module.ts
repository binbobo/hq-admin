import { NgModule } from '@angular/core';
import { SharedModule } from "app/shared/shared.module";
import { MountingsRoutingModule, routedComponents } from "./mountings.routing";
import { PriceCheckService } from './price-check/price-check.service';
import { MountingsService } from './mountings.service';


@NgModule({
  imports: [
    SharedModule,
    MountingsRoutingModule
  ],
  providers: [PriceCheckService, MountingsService],
  declarations: [routedComponents]
})
export class MountingsModule { }
