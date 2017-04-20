import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    { path: 'inbound', loadChildren: 'app/pages/mountings/inbound/inbound.module#InboundModule' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MountingsRoutingModule { }

export const routedComponents = [];