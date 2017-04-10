import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogsRoutingModule, routedComponents } from './logs.routing';
import { ModalModule, PaginationModule } from "ngx-bootstrap";
import { DbLogService } from './db-log/db-log.service';
import { HttpLogService } from './http-log/http-log.service';
import { UsualLogService } from './usual-log/usual-log.service';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    LogsRoutingModule,
    ModalModule.forRoot(),
  ],
  providers: [DbLogService, HttpLogService, UsualLogService],
  declarations: [routedComponents]
})
export class LogsModule { }
