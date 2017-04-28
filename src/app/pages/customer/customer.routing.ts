import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CarOwnerComponent} from './carOwner/car-owner.component';

const routes: Routes = [
    // 车主管理路由
    { path: 'carOwner', component: CarOwnerComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CustomerRoutingModule { }

export const routedComponents = [CarOwnerComponent];

