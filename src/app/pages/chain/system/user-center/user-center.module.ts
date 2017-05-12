import { NgModule } from '@angular/core';
import { RoleListComponent } from './role/role-list/role-list.component';
import { RoleCreateComponent } from './role/role-create/role-create.component';
import { RoleEditComponent } from './role/role-edit/role-edit.component';
import { RoleAllocateComponent } from './role/role-allocate/role-allocate.component';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap';
import { RoleService } from './role/role.service';
import { TreeviewModule } from 'ngx-treeview';

const routes: Routes = [
  { path: 'role', component: RoleListComponent }
];

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    TreeviewModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [RoleService],
  declarations: [RoleListComponent, RoleCreateComponent, RoleEditComponent, RoleAllocateComponent]
})
export class UserCenterModule { }
