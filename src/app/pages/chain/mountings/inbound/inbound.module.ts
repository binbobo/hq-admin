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
import { MaintainCreateComponent } from './maintain-return/maintain-create/maintain-create.component';
import { ChainSharedModule } from "app/pages/chain/chain-shared/chain-shared.module";
import { SalesReturnListComponent } from './sales-return/sales-return-list/sales-return-list.component';
import { SalesReturnCreateComponent } from './sales-return/sales-return-create/sales-return-create.component';
import { SalesReturnPrintComponent } from './sales-return/sales-return-print/sales-return-print.component';
import { CustomFormsModule } from "ng2-validation/dist";
import { SalesReturnService } from "./sales-return/sales-return.service";
import { ProcurementListComponent } from './procurement/procurement-list/procurement-list.component';
import { ProcurementCreateComponent } from './procurement/procurement-create/procurement-create.component';
import { ProcurementPrintComponent } from './procurement/procurement-print/procurement-print.component';
import { ProcurementService } from './procurement/procurement.service';
import { ProviderService } from '../provider/provider.service';
import { MaintainPrintComponent } from './maintain-return/maintain-print/maintain-print.component';
import { PurchaseInBillDirective } from './procurement/purchase-in-bill.directive';


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
  declarations: [routedComponents, ReturnListComponent, ReturnCreateComponent, ReturnPrintComponent, SalesReturnListComponent, SalesReturnCreateComponent, SalesReturnPrintComponent, ProcurementListComponent, ProcurementCreateComponent, ProcurementPrintComponent, MaintainCreateComponent, MaintainPrintComponent, PurchaseInBillDirective],
  providers: [MaintainReturnService, ProcurementService, ProviderService, InnerReturnService, SalesReturnService],

  entryComponents: [routedComponents[0]],
})
export class InboundModule { }
