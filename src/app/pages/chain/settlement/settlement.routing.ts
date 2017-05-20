import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckoutComponent } from "./checkout/checkout.component";
import { WorkorderDetailPrintComponent } from '../reception/shared/workorder-detail-print/workorder-detail-print.component';


const routes: Routes = [
    { path: 'checkout', component: CheckoutComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettlementRoutingModule { }

export const routedComponents = [CheckoutComponent, WorkorderDetailPrintComponent];

