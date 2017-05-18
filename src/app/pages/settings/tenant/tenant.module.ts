import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantEditComponent } from './tenant-edit/tenant-edit.component';
import { TenantCreateComponent } from './tenant-create/tenant-create.component';
import { TenantListComponent } from './tenant-list/tenant-list.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TenantEditComponent, TenantCreateComponent, TenantListComponent]
})
export class TenantModule { }
