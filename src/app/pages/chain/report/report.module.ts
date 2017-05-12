import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "app/shared/shared.module";
import { ReportRoutingModule } from "./report.routing";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { ReactiveFormsModule } from "@angular/forms";
import { NguiDatetimePickerModule } from "@ngui/datetime-picker/dist";
import { TreeviewModule } from "ngx-treeview/lib";
import { CollapseModule, TabsModule, PopoverModule, AlertModule, TypeaheadModule, ModalModule } from "ngx-bootstrap";
import { ChainSharedModule } from "app/pages/chain/chain-shared/chain-shared.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ReportRoutingModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    NguiDatetimePickerModule,
    TreeviewModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    AlertModule.forRoot(),
    TypeaheadModule.forRoot(),
    ModalModule.forRoot(),
    ChainSharedModule
  ],
  declarations: []
})
export class ReportModule { }
