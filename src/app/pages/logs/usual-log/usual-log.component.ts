import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { UsualLog, UsualLogService, UsualLogListRequest } from './usual-log.service';
import { PagedParams, PagedResult } from 'app/shared/models';
import { DataList } from "app/shared/models";
import { AlerterService } from 'app/shared/services';

@Component({
  selector: 'app-usual-log',
  templateUrl: './usual-log.component.html',
  styleUrls: ['./usual-log.component.css'],
  providers: [AlerterService],
})
export class UsualLogComponent extends DataList<UsualLog> {

  constructor(
    injector: Injector,
    protected service: UsualLogService,
  ) {
    super(injector, service);
    this.params = new UsualLogListRequest();
  }
}
