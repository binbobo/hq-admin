import {NgModule} from "@angular/core"
import {SystemRouting,routedComponents} from "./system.routing"

import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { ModalModule } from 'ngx-bootstrap';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'app/shared/shared.module';

import {UserCenterService} from "./usercenter/usercenter.service"

@NgModule({
    imports:[
        SystemRouting,
        SharedModule,
        ReactiveFormsModule,
        TabsModule.forRoot(),
        AlertModule.forRoot(),
        TypeaheadModule.forRoot(),
        ModalModule.forRoot(),
        NguiDatetimePickerModule
    ],
    declarations:[routedComponents],
    providers:[UserCenterService]
   // entryComponents:[routedComponents[0]]
})
export class SystemModule{ }