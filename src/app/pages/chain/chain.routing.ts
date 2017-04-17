import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { AssignOrderComponent } from './assign-order/assign-order.component';
import { CreateOrderComponent } from './create-order/create-order.component';

const routes: Routes = [
    // 工单列表路由
    { path: 'order', component: OrderListComponent },
    // 指派工单列表路由
    { path: 'assign', component: AssignOrderComponent },
    // 创建工单列表路由
    { path: 'create', component: CreateOrderComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChainRoutingModule { }

export const routedComponents = [OrderListComponent, AssignOrderComponent, CreateOrderComponent];
