import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseListComponent } from './warehouse/warehouse-list/warehouse-list.component';
import { WarehouseCreateComponent } from './warehouse/warehouse-create/warehouse-create.component';
import { SharedModule } from 'app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { WarehouseService } from './warehouse/warehouse.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: 'warehouse', component: WarehouseListComponent }
]

@NgModule({
  imports: [
    SharedModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [WarehouseService],
  declarations: [WarehouseListComponent, WarehouseCreateComponent]
})
export class AccessoriesModule { }
