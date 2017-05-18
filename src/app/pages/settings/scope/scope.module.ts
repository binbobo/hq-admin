import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScopeListComponent } from './scope-list/scope-list.component';
import { ScopeCreateComponent } from './scope-create/scope-create.component';
import { ScopeEditComponent } from './scope-edit/scope-edit.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ScopeListComponent, ScopeCreateComponent, ScopeEditComponent]
})
export class ScopeModule { }
