import { NgModule } from '@angular/core';
import { SettlementRoutingModule, routedComponents } from './settlement.routing';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TreeviewModule } from 'ngx-treeview';
import { ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { SharedModule } from 'app/shared/shared.module';
import { BillOrderService } from "app/pages/chain/reception/bill-order/bill-order.service";
import { CheckOutService } from "app/pages/chain/settlement/checkout/checkout.service";
import { CheckoutPrintDetailComponent } from './checkout/checkout-print-detail/checkout-print-detail.component';

@NgModule({
  imports: [
    TreeviewModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    AlertModule.forRoot(),
    TypeaheadModule.forRoot(),
    ModalModule.forRoot(),
    SettlementRoutingModule,
    SharedModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    NguiDatetimePickerModule
  ],
   declarations: [routedComponents, CheckoutPrintDetailComponent],
  providers: [CheckOutService],
  entryComponents: [routedComponents[0]],
})
export class SettlementModule { }
