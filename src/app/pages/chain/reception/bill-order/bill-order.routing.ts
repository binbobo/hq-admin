import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrintOrderComponent } from "app/pages/chain/reception/bill-order/print-order/print-order.component";

const routes: Routes = [
    // 工单列表路由
    { path: 'print', component: PrintOrderComponent },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReceptionRoutingModule { }

export const routedComponents = [PrintOrderComponent];

