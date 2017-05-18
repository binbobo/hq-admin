import { NgModule } from '@angular/core';
import { SharedModule } from "app/shared/shared.module";
import { ReportRoutingModule } from "./report.routing";

@NgModule({
  imports: [
    SharedModule,
    ReportRoutingModule
  ],
  declarations: []
})
export class ReportModule { }
