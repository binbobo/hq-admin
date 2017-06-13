import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckoutComponent } from "./checkout/checkout.component";
import { SaleCheckComponent } from "./sale-check/sale-check.component";

const routes: Routes = [
    { path: 'checkout', component: CheckoutComponent },
    { path:'sale-check',component:SaleCheckComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettlementRoutingModule { }

export const routedComponents = [CheckoutComponent,SaleCheckComponent];

