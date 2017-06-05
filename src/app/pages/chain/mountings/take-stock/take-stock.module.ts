import { NgModule } from '@angular/core';
import { StockListComponent } from './stock-list/stock-list.component';
import { StockListCreateComponent } from './stock-list-create/stock-list-create.component';
import { StockDetailComponent } from './stock-detail/stock-detail.component';
import { SharedModule } from 'app/shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { TakeStockService } from './take-stock.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { MountingsService } from '../mountings.service';
import { ModalModule } from 'ngx-bootstrap';

const routes: Routes = [
  { path: '', component: StockListComponent },
  { path: 'detail/:code', component: StockDetailComponent }
]

@NgModule({
  imports: [
    SharedModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    NguiDatetimePickerModule,
    RouterModule.forChild(routes)
  ],
  providers: [TakeStockService, MountingsService],
  declarations: [StockListComponent, StockListCreateComponent, StockDetailComponent]
})
export class TakeStockModule { }
