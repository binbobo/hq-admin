import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { AssignOrderComponent } from './assign-order/assign-order.component';
import { BillOrderComponent } from './bill-order/bill-order.component';
import { AppendOrderComponent } from './append-order/append-order.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { PrintOrderComponent } from 'app/pages/chain/reception/bill-order/print-order/print-order.component';
import { WorkorderDetailComponent } from './shared/workorder-detail/workorder-detail.component';
import { AddMaintenanceItemComponent } from './shared/add-maintenance-item/add-maintenance-item.component';
import { WorkorderDetailPrintComponent } from './shared/workorder-detail-print/workorder-detail-print.component';

const routes: Routes = [
    // 工单列表路由
    { path: 'order', component: OrderListComponent },
    // 指派工单列表路由
    { path: 'assign', component: AssignOrderComponent },
    // 结算单列表路由
    { path: 'bill', component: BillOrderComponent },
    // 结算单打印路由
    { path: 'bill/print/:id', component: PrintOrderComponent },
    // 增项路由
    { path: 'append', component: AppendOrderComponent },
    // 创建工单列表路由
    { path: 'create', component: CreateOrderComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReceptionRoutingModule { }

export const routedComponents = [WorkorderDetailPrintComponent, WorkorderDetailComponent, AddMaintenanceItemComponent,OrderListComponent, AssignOrderComponent, CreateOrderComponent, BillOrderComponent, AppendOrderComponent, PrintOrderComponent];

