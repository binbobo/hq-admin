import { NgModule } from '@angular/core';
import { BusinessListComponent } from './business/business-list/business-list.component';
import { MaintenanceRoutingModule } from "./maintenance.routing";
import { BusinessService } from "./business/business.service";
import { NguiDatetimePickerModule } from "@ngui/datetime-picker/dist";
import { BsDropdownModule, ModalModule, TypeaheadModule, AlertModule, PopoverModule, TabsModule, CollapseModule } from "ngx-bootstrap";
import { CustomFormsModule } from "ng2-validation/dist";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeviewModule } from "ngx-treeview/lib";
import { ChainSharedModule } from "app/pages/chain/chain-shared/chain-shared.module";
import { SharedModule } from "app/shared/shared.module";
import { PrintViewComponent } from './business/print-view/print-view.component';

@NgModule({
  imports: [
    SharedModule,
    ChainSharedModule,
    TreeviewModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    AlertModule.forRoot(),
    TypeaheadModule.forRoot(),
    ModalModule.forRoot(),
    ReactiveFormsModule,
    NguiDatetimePickerModule,
    FormsModule,
    CustomFormsModule,
    BsDropdownModule.forRoot(),
    MaintenanceRoutingModule,
    
  ],
  declarations: [BusinessListComponent, PrintViewComponent],
  providers:[BusinessService]
})
export class MaintenanceModule { }
