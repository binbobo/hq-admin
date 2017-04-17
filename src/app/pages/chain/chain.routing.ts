import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { AssignOrderComponent } from './assign-order/assign-order.component';
import { BillOrderComponent } from './bill-order/bill-order.component';
import { AppendOrderComponent } from './append-order/append-order.component';
const routes: Routes = [
    // 工单列表路由
    { path: 'order', component: OrderListComponent },
    // 指派工单列表路由
    { path: 'assign', component: AssignOrderComponent },
     // 结算单列表路由
    { path: 'bill', component: BillOrderComponent },
    //增项路由
    {path: 'append', component: AppendOrderComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChainRoutingModule { }

export const routedComponents = [OrderListComponent, AssignOrderComponent,BillOrderComponent,AppendOrderComponent];
