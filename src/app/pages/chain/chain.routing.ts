import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { AssignOrderComponent } from './assign-order/assign-order.component';

const routes: Routes = [
    // 订单列表路由
    { path: 'order', component: OrderListComponent },
    { path: 'assign', component: AssignOrderComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    declarations: [OrderListComponent, AssignOrderComponent]
})
export class ChainRoutingModule { }
