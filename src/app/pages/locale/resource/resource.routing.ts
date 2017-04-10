import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResourceListComponent } from './resource-list/resource-list.component';
import { ResourceCreateComponent } from './resource-create/resource-create.component';
import { ResourceEditComponent } from './resource-edit/resource-edit.component';
import { ResourceDetailResolver } from './resource-detail-resolver.service';

const routes: Routes = [
    { path: '', component: ResourceListComponent },
    { path: 'create', component: ResourceCreateComponent },
    { path: 'edit/:id', component: ResourceEditComponent, resolve: { model: ResourceDetailResolver } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ResourceRoutingModule { }

export const routedComponents = [ResourceListComponent, ResourceCreateComponent, ResourceEditComponent];