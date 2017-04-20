import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaintainReturnComponent } from "./maintain-return/maintain-return.component";
import { SalesReturnComponent } from "./sales-return/sales-return.component";

const routes: Routes = [
    { path: 'maintain-return', component: MaintainReturnComponent },
     {path:'sales-return',component:SalesReturnComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InboundRoutingModule { }

export const routedComponents = [MaintainReturnComponent];