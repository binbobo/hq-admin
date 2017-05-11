import { NgModule } from '@angular/core';
import { DistributeComponent } from './distribute/distribute.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { SalesService } from './sales/sales.service';
import { SalesListComponent } from './sales/sales-list/sales-list.component';
import { SalesCreateComponent } from './sales/sales-create/sales-create.component';
import { ModalModule, BsDropdownModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from "ng2-validation/dist";
import { PrintComponent } from './distribute/print/print.component';
import { ReceiveListComponent } from './receive/receive-list/receive-list.component';
import { ReceiveCreateComponent } from './receive/receive-create/receive-create.component';
import { ReceiveService } from './receive/receive.service';
import { ReceivePrintComponent } from './receive/receive-print/receive-print.component';
import { SalesPrintComponent } from './sales/sales-print/sales-print.component';
import { ChainSharedModule } from '../../chain-shared/chain-shared.module';
import { DistributeCreatComponent } from './distribute/distribute-creat/distribute-creat.component';
import { ProviderService } from '../provider/provider.service';
import { ReturnListComponent } from './purchase-return/return-list/return-list.component';
import { ReturnCreateComponent } from './purchase-return/return-create/return-create.component';
import { ReturnPrintComponent } from './purchase-return/return-print/return-print.component';
import { PurchaseReturnService } from './purchase-return/purchase-return.service';

const routes: Routes = [
  { path: 'maintain-distribute', component: DistributeComponent },
  { path: 'sell', component: SalesListComponent },
  { path: 'inner-receive', component: ReceiveListComponent },
  { path: 'purchase-return', component: ReturnListComponent },
]

@NgModule({
  imports: [
    SharedModule,
    ChainSharedModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
  ],
  exports: [RouterModule],
  providers: [SalesService, ReceiveService, ProviderService, PurchaseReturnService],
  declarations: [DistributeComponent, SalesListComponent, SalesCreateComponent, ReceiveListComponent, ReceiveCreateComponent, ReceivePrintComponent, SalesPrintComponent, PrintComponent, ReturnListComponent, ReturnCreateComponent, ReturnPrintComponent, DistributeCreatComponent]


})
export class OutboundModule { }
