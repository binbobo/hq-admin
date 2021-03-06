import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaintenanceCheckComponent } from './check/maintenance-check.component';

const routes: Routes = [
    { path: 'check', component: MaintenanceCheckComponent },
    { path: 'assign', redirectTo: '/chain/reception/assign' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WorkshopRoutingModule { }

export const routedComponents = [MaintenanceCheckComponent];

