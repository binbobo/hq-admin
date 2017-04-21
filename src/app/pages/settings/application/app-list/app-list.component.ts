import { Component, OnInit, Injector } from '@angular/core';
import { DataList } from 'app/shared/models';
import { Application, ApplicationService, ApplicationListRequest } from '../application.service';

@Component({
  selector: 'app-app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.css']
})
export class AppListComponent extends DataList<Application> {

  constructor(
    injector: Injector,
    protected service: ApplicationService,
  ) {
    super(injector, service);
    this.params = new ApplicationListRequest();
  }

}
