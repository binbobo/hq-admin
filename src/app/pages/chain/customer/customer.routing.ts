import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CarOwnerComponent} from './carOwner/car-owner.component';
import { AddCarownerComponent } from './carOwner/add-carowner/add-carowner.component';
import { AddVehicleComponent } from './carOwner/add-vehicle/add-vehicle.component';
import { EditCarownerComponent } from './carOwner/edit-carowner/edit-carowner.component';

const routes: Routes = [
    // 车主管理路由
    { path: 'owner', component: CarOwnerComponent },
    { path: 'owner/add', component: AddCarownerComponent },
    { path: 'owner/edit/:id', component: EditCarownerComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CustomerRoutingModule { }

export const routedComponents = [CarOwnerComponent, AddCarownerComponent, AddVehicleComponent, EditCarownerComponent];

