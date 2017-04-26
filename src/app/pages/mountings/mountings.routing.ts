import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceCheckComponent } from "app/pages/mountings/price-check";


const routes: Routes = [
    { path: 'inbound', loadChildren: 'app/pages/mountings/inbound/inbound.module#InboundModule' },
    { path: 'inventory', loadChildren: 'app/pages/mountings/inventory/inventory.module#InventoryModule' },
    { path: 'provider', loadChildren: 'app/pages/mountings/provider/provider.module#ProviderModule' },
    { path: 'price', component: PriceCheckComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MountingsRoutingModule { }

export const routedComponents = [PriceCheckComponent];