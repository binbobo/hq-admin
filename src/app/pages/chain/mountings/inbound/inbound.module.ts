import { NgModule } from '@angular/core';
import { SharedModule } from "app/shared/shared.module";
import { InboundRoutingModule, routedComponents } from "./inbound.routing";
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TreeviewModule } from 'ngx-treeview';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule, BsDropdownModule } from 'ngx-bootstrap';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { MaintainReturnService } from "./maintain-return/maintain-return.service";
import { ReturnListComponent } from './inner-return/return-list/return-list.component';
import { ReturnCreateComponent } from './inner-return/return-create/return-create.component';
import { ReturnPrintComponent } from './inner-return/return-print/return-print.component';
import { InnerReturnService } from "./inner-return/inner-return.service";
import { PrintComponent } from './maintain-return/print/print.component';
import { ChainSharedModule } from "app/pages/chain/chain-shared/chain-shared.module";
import { SalesReturnListComponent } from './sales-return/sales-return-list/sales-return-list.component';
import { SalesReturnCreateComponent } from './sales-return/sales-return-create/sales-return-create.component';
import { SalesReturnPrintComponent } from './sales-return/sales-return-print/sales-return-print.component';
import { CustomFormsModule } from "ng2-validation/dist";
import { SalesReturnService } from "./sales-return/sales-return.service";

@NgModule({
  imports: [
    SharedModule,
    ChainSharedModule,
    InboundRoutingModule,
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
  ],
  declarations: [routedComponents, ReturnListComponent, ReturnCreateComponent, ReturnPrintComponent, PrintComponent,routedComponents, SalesReturnListComponent, SalesReturnCreateComponent, SalesReturnPrintComponent],
  providers: [MaintainReturnService,InnerReturnService,SalesReturnService],
  entryComponents: [routedComponents[0]],
})
export class InboundModule { }
