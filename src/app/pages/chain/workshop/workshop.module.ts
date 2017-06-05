import { NgModule } from '@angular/core';
import { WorkshopService } from './workshop.service';
import { WorkshopRoutingModule, routedComponents  } from './workshop.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ModalModule } from 'ngx-bootstrap';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'app/shared/shared.module';
import { ChainSharedModule } from '../chain-shared/chain-shared.module';

@NgModule({
  imports: [
    WorkshopRoutingModule,
    SharedModule.forRoot(),
    ReactiveFormsModule,
    TabsModule.forRoot(),
    AlertModule.forRoot(),
    TypeaheadModule.forRoot(),
    ModalModule.forRoot(),
    NguiDatetimePickerModule,
    ChainSharedModule
  ],
  declarations: [routedComponents],
  providers: [WorkshopService],
})
export class WorkshopModule { }
