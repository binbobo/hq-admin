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
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { SharedModule } from 'app/shared/shared.module';
import { BillOrderService } from "app/pages/chain/reception/bill-order/bill-order.service";
import { CheckOutService } from "app/pages/chain/settlement/checkout/checkout.service";
import { SaleCheckService } from "app/pages/chain/settlement/sale-check/sale-check.service";
import { CheckoutPrintDetailComponent } from './checkout/checkout-print-detail/checkout-print-detail.component';
import { SaleCheckComponent } from './sale-check/sale-check.component';
import { SaleCheckDetailComponent } from './sale-check/sale-check-detail/sale-check-detail.component';
import { ChainSharedModule } from '../chain-shared/chain-shared.module';

@NgModule({
  imports: [
    ChainSharedModule,
    TreeviewModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    AlertModule.forRoot(),
    TypeaheadModule.forRoot(),
    SettlementRoutingModule,
    SharedModule.forRoot(),
    Ng2SmartTableModule,
    ReactiveFormsModule,
    NguiDatetimePickerModule
  ],
  declarations: [routedComponents, CheckoutPrintDetailComponent, SaleCheckComponent, SaleCheckDetailComponent],
  providers: [CheckOutService, SaleCheckService],
  entryComponents: [routedComponents[0]],
})
export class SettlementModule { }
