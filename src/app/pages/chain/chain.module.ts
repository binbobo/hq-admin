import { NgModule } from '@angular/core';
import { ChainRoutingModule, routedComponents } from './chain.routing';
import { SharedModule } from '../../shared/shared.module';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import {DropdownTreeviewModule} from 'ng2-dropdown-treeview';

import { OrderService } from './order.service';


@NgModule({
  imports: [
    DropdownTreeviewModule.forRoot(),
    DatepickerModule.forRoot(),
    ChainRoutingModule,
    SharedModule
  ],
  declarations: [routedComponents],
  providers: [OrderService]
})
export class ChainModule { }
