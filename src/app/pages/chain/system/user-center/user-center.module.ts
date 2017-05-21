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
import { UserListComponent } from './user/user-list/user-list.component';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserService } from './user/user.service';
import { NgPipesModule } from 'ngx-pipes';

const routes: Routes = [
  { path: 'role', component: RoleListComponent },
  { path: 'user', component: UserListComponent }
];

@NgModule({
  imports: [
    NgPipesModule,
    SharedModule,
    FormsModule,
    TreeviewModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [RoleService, UserService],
  declarations: [RoleListComponent, RoleCreateComponent, RoleEditComponent, RoleAllocateComponent, UserListComponent, UserCreateComponent, UserEditComponent]
})
export class UserCenterModule { }
