import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaintainReturnComponent } from "./maintain-return/maintain-return.component";
import { ReturnListComponent } from "./inner-return/return-list/return-list.component";
import { SalesReturnListComponent } from "./sales-return/sales-return-list/sales-return-list.component";
import { ProcurementListComponent } from './procurement/procurement-list/procurement-list.component';

const routes: Routes = [
    { path: 'maintain-return', component: MaintainReturnComponent },
    { path: 'sales-return', component: SalesReturnListComponent },
    { path: 'inner-return', component: ReturnListComponent },
    { path: 'procurement', component: ProcurementListComponent },
];

@NgModule({  
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InboundRoutingModule { }

export const routedComponents = [MaintainReturnComponent];