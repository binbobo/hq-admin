import { NgModule } from '@angular/core';
import { DistributeComponent } from './distribute/distribute.component';
import { ReceiveComponent } from './receive/receive.component';
import { ReturnComponent } from './return/return.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { SalesService } from './sales/sales.service';
import { SalesListComponent } from './sales/sales-list/sales-list.component';
import { SalesCreateComponent } from './sales/sales-create/sales-create.component';
import { ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: 'maintain-distribute', component: DistributeComponent },
  { path: 'sell', component: SalesListComponent },
  { path: 'inner-receive', component: ReceiveComponent },
  { path: 'purchase-return', component: ReturnComponent },
]

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [SalesService],
  declarations: [DistributeComponent, SalesListComponent, ReceiveComponent, ReturnComponent, SalesCreateComponent]
})
export class OutboundModule { }
