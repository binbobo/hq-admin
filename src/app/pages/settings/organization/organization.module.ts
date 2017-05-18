import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgListComponent } from './org-list/org-list.component';
import { OrgCreateComponent } from './org-create/org-create.component';
import { OrgEditComponent } from './org-edit/org-edit.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [OrgListComponent, OrgCreateComponent, OrgEditComponent]
})
export class OrganizationModule { }
