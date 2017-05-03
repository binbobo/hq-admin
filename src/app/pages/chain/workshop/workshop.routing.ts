import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaintenanceCheckComponent } from './check/maintenance-check.component';


const routes: Routes = [{
    // 维修派工路由
    path: '',
    children: [
        // 维修验收路由
        { path: 'check', component: MaintenanceCheckComponent },
        { path: 'assign', redirectTo: '/chain/reception/assign' },
    ]

}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WorkshopRoutingModule { }

export const routedComponents = [MaintenanceCheckComponent];

