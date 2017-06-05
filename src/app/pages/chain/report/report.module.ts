import { NgModule } from '@angular/core';
import { SharedModule } from "app/shared/shared.module";
import { ReportRoutingModule } from "./report.routing";

@NgModule({
  imports: [
    SharedModule.forRoot(),
    ReportRoutingModule
  ],
  declarations: []
})
export class ReportModule { }
