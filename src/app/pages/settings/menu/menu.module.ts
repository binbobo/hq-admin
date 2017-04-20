import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuRoutingModule, routedComponents } from './menu.routing';
import { MenuService } from './menu.service';
import { MenuDetailResolver } from './menu-detail-resolver.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { ScopeService } from '../scope/scope.service';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MenuRoutingModule
  ],
  providers: [MenuService, ScopeService, MenuDetailResolver],
  declarations: [routedComponents]
})
export class MenuModule { }
