import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { HttpLogService, HttpLog, HttpLogListRequest } from './http-log.service';
import { PagedParams, PagedResult } from 'app/shared/models';
import { DataList,DataListWithDetail } from "app/shared/models";

@Component({
  selector: 'app-http-log',
  templateUrl: './http-log.component.html',
  styleUrls: ['./http-log.component.css'],
})
export class HttpLogComponent extends DataListWithDetail<HttpLog> {

  constructor(
    injector: Injector,
    protected service: HttpLogService,
  ) {
    super(injector, service);
    this.params = new HttpLogListRequest();
  }
}
