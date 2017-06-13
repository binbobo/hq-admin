import { NgModule } from '@angular/core';
import { BusinessListComponent } from './business/business-list/business-list.component';
import { MaintenanceRoutingModule } from "./maintenance.routing";
import { BusinessService } from "./business/business.service";
import { NguiDatetimePickerModule } from "@ngui/datetime-picker/dist";
import { BsDropdownModule, TypeaheadModule, AlertModule, PopoverModule, TabsModule, CollapseModule } from "ngx-bootstrap";
import { CustomFormsModule } from "ng2-validation/dist";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TreeviewModule } from "ngx-treeview/lib";
import { ChainSharedModule } from "app/pages/chain/chain-shared/chain-shared.module";
import { SharedModule } from "app/shared/shared.module";
import { PrintViewComponent } from './business/print-view/print-view.component';
import { TotalValueService } from "app/pages/chain/report/total-value/total-value.service";
@NgModule({
  imports: [
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    ChainSharedModule,
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    AlertModule.forRoot(),
    TypeaheadModule.forRoot(),
    ReactiveFormsModule,
    NguiDatetimePickerModule,
    FormsModule,
    CustomFormsModule,
    BsDropdownModule.forRoot(),
    MaintenanceRoutingModule,
    
  ],
  declarations: [BusinessListComponent, PrintViewComponent],
  providers:[BusinessService,TotalValueService]
})
export class MaintenanceModule { }
