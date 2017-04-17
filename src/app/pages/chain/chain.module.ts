import { NgModule } from '@angular/core';
import { ChainRoutingModule, routedComponents } from './chain.routing';
import { SharedModule } from '../../shared/shared.module';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import {DropdownTreeviewModule} from 'ng2-dropdown-treeview';
import { ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs'; 
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { OrderService } from './order.service';


@NgModule({
  imports: [
    DropdownTreeviewModule.forRoot(),
    DatepickerModule.forRoot(),
    TabsModule.forRoot(),
    ChainRoutingModule,
    SharedModule,
    Ng2SmartTableModule,
    ReactiveFormsModule
  ],
  declarations: [routedComponents],
  providers: [OrderService]
})
export class ChainModule { }
