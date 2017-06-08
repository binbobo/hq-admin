import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { InventoryCreateComponent } from './inventory-create/inventory-create.component';
import { InventoryEditComponent } from './inventory-edit/inventory-edit.component';
import { SharedModule } from 'app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { InventoryService } from './inventory.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap';
import { TreeviewModule } from 'ngx-treeview';
import { NgPipesModule } from 'ngx-pipes';
import { ChainSharedModule } from '../../chain-shared/chain-shared.module';
import { InventoryProductTypeaheadDirective } from './inventory-product-typeahead.directive';

const routes: Routes = [
  { path: '', component: InventoryListComponent },
  { path: 'create', component: InventoryCreateComponent },
  { path: 'edit/:id', component: InventoryEditComponent },
]

@NgModule({
  imports: [
    TreeviewModule.forRoot(),
    SharedModule.forRoot(),
    ChainSharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgPipesModule,
    TypeaheadModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  providers: [InventoryService],
  declarations: [InventoryListComponent, InventoryCreateComponent, InventoryEditComponent, InventoryProductTypeaheadDirective]
})
export class InventoryModule { }
