import { NgModule } from '@angular/core';
import { TotalValueComponent } from './total-value.component';
import { SharedModule } from 'app/shared/shared.module';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { TotalValueService } from './total-value.service';
import { Routes, RouterModule } from '@angular/router';
import { treeviewEventParser } from "app/shared/services";
import { NgPipesModule } from 'ngx-pipes';

const routes: Routes = [
  { path: '', component: TotalValueComponent }
];

@NgModule({
  imports: [
    SharedModule.forRoot(),
    NguiDatetimePickerModule,
    RouterModule.forChild(routes),
    NgPipesModule
  ],
  providers: [TotalValueService, treeviewEventParser],
  declarations: [TotalValueComponent]
})
export class TotalValueModule { }
