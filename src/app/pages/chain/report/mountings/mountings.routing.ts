import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: 'statistics', loadChildren: 'app/pages/chain/report/mountings/statistics/statistics.module#StatisticsModule' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MountingsRoutingModule { }