import { Component, OnInit, Injector } from '@angular/core';
import { DataList, SelectOption } from 'app/shared/models';
import { Client, ClientService, ClientListRequest } from '../client.service';
import { ApplicationService } from '../../application/application.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent extends DataList<Client> implements OnInit {

  private applications: Array<SelectOption>;

  constructor(
    injector: Injector,
    service: ClientService,
    private appService: ApplicationService
  ) {
    super(injector, service);
    this.params = new ClientListRequest();
  }

  ngOnInit() {
    super.ngOnInit();
    this.appService.getSelectOptions()
      .then(data => this.applications = data)
      .catch(err => this.alerter.error(err));
  }

}
