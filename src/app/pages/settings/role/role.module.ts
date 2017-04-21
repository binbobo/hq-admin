import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScopeListComponent } from './scope-list/scope-list.component';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleCreateComponent } from './role-create/role-create.component';
import { RoleEditComponent } from './role-edit/role-edit.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ScopeListComponent, RoleListComponent, RoleCreateComponent, RoleEditComponent]
})
export class RoleModule { }
