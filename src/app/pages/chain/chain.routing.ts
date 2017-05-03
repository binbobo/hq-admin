import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        children: [
            { path: 'reception', loadChildren: 'app/pages/chain/reception/reception.module#ReceptionModule' },
            { path: 'mountings', loadChildren: 'app/pages/chain/mountings/mountings.module#MountingsModule' },
            { path: 'workshop', loadChildren: 'app/pages/chain/workshop/workshop.module#WorkshopModule' },
            { path: 'customer', loadChildren: 'app/pages/chain/customer/customer.module#CustomerModule' },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChainRoutingModule { }