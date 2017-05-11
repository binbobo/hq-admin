import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessListComponent } from './business/business-list/business-list.component';
import { BusinessDetailComponent } from './business/business-detail/business-detail.component';
import { SharedModule } from "app/shared/shared.module";
import { ModalModule } from "ngx-bootstrap";
import { MaintenanceRoutingModule } from "./maintenance.routing";

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    SharedModule,
    MaintenanceRoutingModule
  ],
  declarations: [BusinessListComponent, BusinessDetailComponent]
})
export class MaintenanceModule { }
