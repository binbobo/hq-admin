import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { DbLogService, DbLog, DbLogListRequest } from './db-log.service';
import { PagedParams, PagedResult } from 'app/shared/models';
import { DataList, DataListWithDetail } from "app/shared/models";

@Component({
  selector: 'app-db-log',
  templateUrl: './db-log.component.html',
  styleUrls: ['./db-log.component.css'],
})
export class DbLogComponent extends DataListWithDetail<DbLog> {

  constructor(
    injector: Injector,
    protected service: DbLogService,
  ) {
    super(injector, service);
    this.params = new DbLogListRequest();
  }
}
