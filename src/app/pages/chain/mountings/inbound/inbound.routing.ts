import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaintainReturnComponent } from "./maintain-return/maintain-return.component";
import { SalesReturnComponent } from "./sales-return/sales-return.component";
import { ReturnListComponent } from "./inner-return/return-list/return-list.component";

const routes: Routes = [
    { path: 'maintain-return', component: MaintainReturnComponent },
     {path:'sales-return',component:SalesReturnComponent},
     {path:'inner-return',component:ReturnListComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InboundRoutingModule { }

export const routedComponents = [MaintainReturnComponent];