import { NgModule } from '@angular/core';
import { SharedModule } from "app/shared/shared.module";
import { InboundRoutingModule, routedComponents } from "./inbound.routing";
import { SalesReturnComponent } from './sales-return/sales-return.component';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TreeviewModule } from 'ngx-treeview';
import { ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { SelectModule } from 'ng2-select';
import { MaintainReturnService } from "app/pages/chain/mountings/inbound/maintain-return/maintain-return.service";
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
    SelectModule,
    SharedModule,
    ReactiveFormsModule,
    NguiDatetimePickerModule
  ],
  declarations: [routedComponents, SalesReturnComponent],
  providers: [MaintainReturnService],
  entryComponents: [routedComponents[0]],
})
export class InboundModule { }
