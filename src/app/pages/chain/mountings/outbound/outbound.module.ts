import { NgModule } from '@angular/core';
import { DistributeComponent } from './distribute/distribute.component';
import { ReturnComponent } from './return/return.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { SalesService } from './sales/sales.service';
import { SalesListComponent } from './sales/sales-list/sales-list.component';
import { SalesCreateComponent } from './sales/sales-create/sales-create.component';
import { ModalModule, BsDropdownModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomFormsModule } from "ng2-validation/dist";
import { ReceiveListComponent } from './receive/receive-list/receive-list.component';
import { ReceiveCreateComponent } from './receive/receive-create/receive-create.component';
import { ReceiveService } from './receive/receive.service';
import { ReceivePrintComponent } from './receive/receive-print/receive-print.component';
import { SalesPrintComponent } from './sales/sales-print/sales-print.component';

const routes: Routes = [
  { path: 'maintain-distribute', component: DistributeComponent },
  { path: 'sell', component: SalesListComponent },
  { path: 'inner-receive', component: ReceiveListComponent },
  { path: 'purchase-return', component: ReturnComponent },
]

@NgModule({
  imports: [
    SharedModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
    BsDropdownModule.forRoot(),
  ],
  exports: [RouterModule],
  providers: [SalesService, ReceiveService],
  declarations: [DistributeComponent, SalesListComponent, ReturnComponent, SalesCreateComponent, ReceiveListComponent, ReceiveCreateComponent, ReceivePrintComponent, SalesPrintComponent]
})
export class OutboundModule { }
