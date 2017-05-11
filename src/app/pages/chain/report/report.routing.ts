import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    { path: 'maintenance', loadChildren: 'app/pages/chain/report/maintenance/maintenance.module#MaintenanceModule' },
    { path: 'mountings', loadChildren: 'app/pages/chain/report/mountings/mountings.module#MountingsModule' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ReportRoutingModule { }
