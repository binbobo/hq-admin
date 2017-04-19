import { NgModule } from '@angular/core';
import { ChainRoutingModule, routedComponents } from './chain.routing';
import { SharedModule } from '../../shared/shared.module';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import {DropdownTreeviewModule} from 'ng2-dropdown-treeview';
import { ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { NguiDatetimePickerModule} from '@ngui/datetime-picker';
import { ModalModule } from 'ngx-bootstrap/modal';


import { OrderService } from './order.service';
import { CustomRenderComponent } from './create-order/render-datetime.component';

@NgModule({
  imports: [
    DropdownTreeviewModule.forRoot(),
    DatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    ModalModule.forRoot(),
    ChainRoutingModule,
    SharedModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    NguiDatetimePickerModule
  ],
  declarations: [routedComponents,CustomRenderComponent],
  providers: [OrderService]
})
export class ChainModule { }
