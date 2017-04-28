import { NgModule } from '@angular/core';
import { WorkshopService } from './workshop.service';
import { AssignService } from '../reception/assign.service';
import { WorkshopRoutingModule, routedComponents  } from './workshop.routing';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ModalModule } from 'ngx-bootstrap';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [
    WorkshopRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    TabsModule.forRoot(),
    AlertModule.forRoot(),
    TypeaheadModule.forRoot(),
    ModalModule.forRoot(),
    NguiDatetimePickerModule
  ],
  declarations: [routedComponents],
  providers: [WorkshopService, AssignService],
})
export class WorkshopModule { }
