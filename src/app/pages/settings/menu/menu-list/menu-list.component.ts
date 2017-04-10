import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { DataList } from "app/shared/models";
import { Menu, MenuService, MenuListRequest } from '../menu.service';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css'],
})
export class MenuListComponent extends DataList<Menu> {

  constructor(
    injector: Injector,
    protected service: MenuService,
  ) {
    super(injector, service);
    this.params = new MenuListRequest();
  }
}
