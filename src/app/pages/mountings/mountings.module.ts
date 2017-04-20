import { NgModule } from '@angular/core';
import { SharedModule } from "app/shared/shared.module";
import { MountingsRoutingModule, routedComponents } from "app/pages/mountings/mountings.routing";

@NgModule({
  imports: [
    SharedModule,
    MountingsRoutingModule
  ],
  declarations: [routedComponents]
})
export class MountingsModule { }
