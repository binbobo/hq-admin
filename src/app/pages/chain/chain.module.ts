import { NgModule } from '@angular/core';
import { ChainRoutingModule, routedComponents } from './chain.routing';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { DropdownTreeviewModule } from 'ng2-dropdown-treeview';
import { ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { AlertModule } from 'ngx-bootstrap';
import { OrderService } from './order.service';
import { ModalModule } from 'ngx-bootstrap';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    DropdownTreeviewModule.forRoot(),
    DatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    ChainRoutingModule,
    SharedModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    NguiDatetimePickerModule
  ],
  declarations: [routedComponents],
  providers: [OrderService],
  entryComponents: [routedComponents[0]], // 配置CustomDatetimeEditorComponent
})
export class ChainModule { }
