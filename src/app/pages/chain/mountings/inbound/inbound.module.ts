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
import { MaintainReturnService } from "app/pages/chain/mountings/inbound/maintain-return/maintain-return.service";
import { PrintComponent } from './maintain-return/print/print.component';
import { ProcurementListComponent } from './procurement/procurement-list/procurement-list.component';
import { ProcurementCreateComponent } from './procurement/procurement-create/procurement-create.component';
import { ProcurementPrintComponent } from './procurement/procurement-print/procurement-print.component';
import { ProcurementService } from './procurement/procurement.service';
import { ChainSharedModule } from '../../chain-shared/chain-shared.module';
import { ProviderService } from '../provider/provider.service';
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
    NguiDatetimePickerModule
  ],
  declarations: [routedComponents, SalesReturnComponent, PrintComponent, ProcurementListComponent, ProcurementCreateComponent, ProcurementPrintComponent],
  providers: [MaintainReturnService, ProcurementService, ProviderService],
  entryComponents: [routedComponents[0]],
})
export class InboundModule { }
