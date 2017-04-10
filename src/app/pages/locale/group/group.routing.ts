import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupCreateComponent } from './group-create/group-create.component';
import { GroupEditComponent } from './group-edit/group-edit.component';
import { GroupDetailResolver } from './group-detail-resolver.service';

const routes: Routes = [
    { path: '', component: GroupListComponent },
    { path: 'create', component: GroupCreateComponent },
    { path: 'edit/:id', component: GroupEditComponent, resolve: { model: GroupDetailResolver } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GroupRoutingModule { }

export const routedComponents = [GroupListComponent, GroupCreateComponent, GroupEditComponent];