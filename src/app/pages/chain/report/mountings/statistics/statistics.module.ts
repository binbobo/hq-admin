import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "app/shared/shared.module";
import { BsDropdownModule, TypeaheadModule, AlertModule, PopoverModule, TabsModule, CollapseModule } from "ngx-bootstrap";
import { ChainSharedModule } from "app/pages/chain/chain-shared/chain-shared.module";
import { NguiDatetimePickerModule } from "@ngui/datetime-picker/dist";
import { CustomFormsModule } from "ng2-validation/dist";
import { TreeviewModule } from "ngx-treeview/lib";
import { StatisticsRoutingModule } from "./statistics.routing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

//组件
import { ProcurementComponent } from './procurement/procurement.component';
import { DistributeComponent } from './distribute/distribute.component';
import { PartssalesComponent } from './partssales/partssales.component';
import { InnerReceiveComponent } from './inner-receive/inner-receive.component';
import { InvoicingComponent } from './invoicing/invoicing.component';
import { DistributePrintComponent } from './distribute/distribute-print/distribute-print.component';
import { ProcurementPrintComponent } from './procurement/procurement-print/procurement-print.component';
import { ReceivePrintComponent } from './inner-receive/receive-print/receive-print.component';
import { PartssalesPrintComponent } from './partssales/partssales-print/partssales-print.component';

//服务
import { ProcurementService } from "app/pages/chain/report/mountings/statistics/procurement/procurement.service";
import { DistributeService } from "app/pages/chain/report/mountings/statistics/distribute/distribute.service";
import { PartssalesService } from "app/pages/chain/report/mountings/statistics/partssales/partssales.service";
import { ReceiveService } from "app/pages/chain/report/mountings/statistics/inner-receive/receive.service";
import { InvoicingService } from "app/pages/chain/report/mountings/statistics/invoicing/invoicing.service";
import { TotalValueService } from "app/pages/chain/report/total-value/total-value.service";
import { treeviewEventParser } from "app/shared/services";

@NgModule({
  imports: [
    NguiDatetimePickerModule,
    TreeviewModule.forRoot(),
    StatisticsRoutingModule,
    ChainSharedModule,
    SharedModule.forRoot(),
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    AlertModule.forRoot(),
    PopoverModule.forRoot(),
    TabsModule.forRoot(),
    CollapseModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
  ],
  declarations: [
    ProcurementComponent,
    DistributeComponent,
    PartssalesComponent,
    InnerReceiveComponent,
    InvoicingComponent,
    DistributePrintComponent,
    ProcurementPrintComponent,
    ReceivePrintComponent,
    PartssalesPrintComponent,
  ],
  providers: [ProcurementService, TotalValueService, DistributeService, PartssalesService, ReceiveService, InvoicingService,treeviewEventParser]
})
export class StatisticsModule { }