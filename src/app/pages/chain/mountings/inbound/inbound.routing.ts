import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaintainReturnComponent } from "./maintain-return/maintain-return.component";
import { SalesReturnComponent } from "./sales-return/sales-return.component";
import { PrintComponent } from "app/pages/chain/mountings/inbound/maintain-return/print/print.component";
import { ProcurementListComponent } from './procurement/procurement-list/procurement-list.component';

const routes: Routes = [
    { path: 'maintain-return', component: MaintainReturnComponent },
    { path: 'sales-return', component: SalesReturnComponent },
    { path: 'procurement', component: ProcurementListComponent },
    { path: 'maintain-return/print', component: PrintComponent }
];

@NgModule({  
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class InboundRoutingModule { }

export const routedComponents = [MaintainReturnComponent, PrintComponent];