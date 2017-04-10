import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyCreateComponent } from './property-create/property-create.component';
import { PropertyEditComponent } from './property-edit/property-edit.component';
import { PropertyDetailResolver } from './property-detail-resolver.service';

const routes: Routes = [
    { path: '', component: PropertyListComponent },
    { path: 'create', component: PropertyCreateComponent },
    { path: 'edit/:id', component: PropertyEditComponent, resolve: { model: PropertyDetailResolver } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PropertyRoutingModule { }

export const routedComponents = [PropertyListComponent, PropertyCreateComponent, PropertyEditComponent];