import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssignOrderComponent } from '../reception/assign-order/assign-order.component';
import { MaintenanceCheckComponent } from './check/maintenance-check.component';


const routes: Routes = [
    // 维修派工路由
    { path: 'assign', component: AssignOrderComponent },
    // 维修验收路由
    { path: 'check', component: MaintenanceCheckComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WorkshopRoutingModule { }

export const routedComponents = [AssignOrderComponent, MaintenanceCheckComponent];

