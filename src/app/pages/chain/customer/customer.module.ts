import { NgModule } from '@angular/core';
import { CustomerService } from './customer.service';
import { CustomerRoutingModule, routedComponents } from './customer.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'app/shared/shared.module';
import { OrderService } from '../reception/order.service';
import { ChainSharedModule } from '../chain-shared/chain-shared.module';

@NgModule({
  imports: [
    CustomerRoutingModule,
    SharedModule.forRoot(),
    ReactiveFormsModule,
    TabsModule.forRoot(),
    AlertModule.forRoot(),
    TypeaheadModule.forRoot(),
    NguiDatetimePickerModule,
    ChainSharedModule,
  ],
  declarations: [routedComponents],
  providers: [CustomerService, OrderService],
})
export class CustomerModule { }
