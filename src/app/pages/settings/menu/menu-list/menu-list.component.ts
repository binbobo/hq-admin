import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { DataList, SelectOption } from 'app/shared/models';
import { Menu, MenuService, MenuListRequest } from '../menu.service';
import { ClientService } from '../../client/client.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css'],
})
export class MenuListComponent extends DataList<Menu> implements OnInit {

  private clients: Array<SelectOption>;

  constructor(
    injector: Injector,
    service: MenuService,
    private clientService: ClientService,
  ) {
    super(injector, service);
    this.params = new MenuListRequest();
  }

  ngOnInit() {
    super.ngOnInit();
    this.clientService.getSelectOptions()
      .then(data => this.clients = data)
      .catch(err => this.alerter.warn(err));
  }
}
