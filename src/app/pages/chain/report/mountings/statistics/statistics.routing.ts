import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProcurementComponent } from './procurement/procurement.component';
import { DistributeComponent } from './distribute/distribute.component';
import { PartssalesComponent } from './partssales/partssales.component';
import { InnerReceiveComponent } from './inner-receive/inner-receive.component';
import { InvoicingComponent } from './invoicing/invoicing.component';

const routes: Routes = [
    { path: 'procurement', component: ProcurementComponent },
    { path: 'distribute', component: DistributeComponent },
    { path: 'partssales', component: PartssalesComponent },
    { path: 'inner-receive', component: InnerReceiveComponent },
    { path: 'invoicing', component: InvoicingComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StatisticsRoutingModule { }