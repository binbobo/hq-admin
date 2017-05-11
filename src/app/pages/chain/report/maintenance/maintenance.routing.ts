import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessListComponent } from "./business/business-list/business-list.component";

const routes: Routes = [
    { path: 'business', component: BusinessListComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MaintenanceRoutingModule { }