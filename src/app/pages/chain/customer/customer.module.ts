import { NgModule } from '@angular/core';
import { CustomerService } from './customer.service';
import { CustomerRoutingModule, routedComponents } from './customer.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ModalModule } from 'ngx-bootstrap';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CustomerRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    AlertModule.forRoot(),
    TypeaheadModule.forRoot(),
    ModalModule.forRoot(),
    NguiDatetimePickerModule
  ],
  declarations: [routedComponents],
  providers: [CustomerService],
})
export class CustomerModule { }
