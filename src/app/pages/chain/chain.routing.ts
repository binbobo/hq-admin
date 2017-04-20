import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { AssignOrderComponent } from './assign-order/assign-order.component';
import { BillOrderComponent } from './bill-order/bill-order.component';
import { AppendOrderComponent } from './append-order/append-order.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { CustomDatetimeEditorComponent } from './create-order/custom-datetime-editor.component';

const routes: Routes = [
    // 工单列表路由
    { path: 'order', component: OrderListComponent },
    // 指派工单列表路由
    { path: 'assign', component: AssignOrderComponent},
     // 结算单列表路由
    { path: 'bill', component: BillOrderComponent },
    // 增项路由
    {path: 'append', component: AppendOrderComponent},
    // 创建工单列表路由
    { path: 'create', component: CreateOrderComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChainRoutingModule { }

export const routedComponents = [CustomDatetimeEditorComponent, OrderListComponent, AssignOrderComponent, CreateOrderComponent,BillOrderComponent,AppendOrderComponent];

