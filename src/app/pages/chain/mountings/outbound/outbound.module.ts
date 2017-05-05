import { NgModule } from '@angular/core';
import { DistributeComponent } from './distribute/distribute.component';
import { SellComponent } from './sell/sell.component';
import { ReceiveComponent } from './receive/receive.component';
import { ReturnComponent } from './return/return.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap';

const routes: Routes = [
  { path: 'maintain-distribute', component: DistributeComponent },
  { path: 'sell', component: SellComponent },
  { path: 'inner-receive', component: ReceiveComponent },
  { path: 'purchase-return', component: ReturnComponent },
]

@NgModule({
  imports: [
    SharedModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  declarations: [DistributeComponent, SellComponent, ReceiveComponent, ReturnComponent]
})
export class OutboundModule { }
