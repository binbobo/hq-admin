import {ChainSharedModule} from '../chain-shared/chain-shared.module';
import { NgModule } from '@angular/core';
import { ReceptionRoutingModule, routedComponents } from './reception.routing';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TreeviewModule } from 'ngx-treeview';
import { ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { AlertModule } from 'ngx-bootstrap/alert';
import { OrderService } from './order.service';
import { AssignService } from './assign.service';
import { ModalModule } from 'ngx-bootstrap';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { SharedModule } from 'app/shared/shared.module';
import { BillOrderService } from "app/pages/chain/reception/bill-order/bill-order.service";
import { AddAttachItemComponent } from './shared/add-attach-item/add-attach-item.component';
import { AddSuggestItemComponent } from './shared/add-suggest-item/add-suggest-item.component';

@NgModule({
  imports: [
    TreeviewModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    AlertModule.forRoot(),
    TypeaheadModule.forRoot(),
    ModalModule.forRoot(),
    ReceptionRoutingModule,
    ChainSharedModule,
    SharedModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    NguiDatetimePickerModule
  ],
  declarations: [routedComponents, AddAttachItemComponent, AddSuggestItemComponent],
  providers: [OrderService, AssignService, BillOrderService],
})
export class ReceptionModule { }
