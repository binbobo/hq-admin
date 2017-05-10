import { NgModule } from '@angular/core';
import { SharedModule } from "app/shared/shared.module";
import { InboundRoutingModule, routedComponents } from "./inbound.routing";
import { SalesReturnComponent } from './sales-return/sales-return.component';
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
import { MaintainReturnService } from "app/pages/chain/mountings/inbound/maintain-return/maintain-return.service";
import { ReturnListComponent } from './inner-return/return-list/return-list.component';
import { ReturnCreateComponent } from './inner-return/return-create/return-create.component';
import { ReturnPrintComponent } from './inner-return/return-print/return-print.component';
import { InnerReturnService } from "./inner-return/inner-return.service";
@NgModule({
  imports: [
    SharedModule,
    InboundRoutingModule,
    TreeviewModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    AlertModule.forRoot(),
    TypeaheadModule.forRoot(),
    ModalModule.forRoot(),
    SharedModule,
    ReactiveFormsModule,
    NguiDatetimePickerModule,
    FormsModule,
    BsDropdownModule.forRoot(),
  ],
  declarations: [routedComponents, SalesReturnComponent, ReturnListComponent, ReturnCreateComponent, ReturnPrintComponent],
  providers: [MaintainReturnService,InnerReturnService],
  entryComponents: [routedComponents[0]],
})
export class InboundModule { }
