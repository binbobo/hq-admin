import {NgModule} from "@angular/core"
import {SystemRouting,routedComponents} from "./system.routing"

import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap';
import { SharedModule } from 'app/shared/shared.module';
import {TreeviewModule} from "ngx-treeview"


import {UserCenterService} from "./usercenter/usercenter.service"

@NgModule({
    imports:[
        SystemRouting,
        SharedModule,
        ReactiveFormsModule,
        AlertModule.forRoot(),
        ModalModule.forRoot(),
        TreeviewModule.forRoot()
    ],
    declarations:[routedComponents],
    providers:[UserCenterService]
   // entryComponents:[routedComponents[0]]
})
export class SystemModule{ }