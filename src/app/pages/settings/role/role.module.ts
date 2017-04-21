import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleCreateComponent } from './role-create/role-create.component';
import { RoleEditComponent } from './role-edit/role-edit.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [RoleListComponent, RoleCreateComponent, RoleEditComponent]
})
export class RoleModule { }
