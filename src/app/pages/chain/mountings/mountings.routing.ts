import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PriceCheckComponent } from "app/pages/chain/mountings/price-check";


const routes: Routes = [
    { path: 'inbound', loadChildren: 'app/pages/chain/mountings/inbound/inbound.module#InboundModule' },
    { path: 'inventory', loadChildren: 'app/pages/chain/mountings/inventory/inventory.module#InventoryModule' },
    { path: 'provider', loadChildren: 'app/pages/chain/mountings/provider/provider.module#ProviderModule' },
    { path: 'inventory-list', loadChildren: 'app/pages/mountings/chain/take-stock/take-stock.module#TakeStockModule' },
    { path: 'journal-account', loadChildren: 'app/pages/mountings/chain/journal-account/journal-account.module#JournalAccountModule' },
    { path: 'price', component: PriceCheckComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MountingsRoutingModule { }

export const routedComponents = [PriceCheckComponent];