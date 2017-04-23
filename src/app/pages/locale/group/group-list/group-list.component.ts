import { Component, OnInit, Injector } from '@angular/core';
import { Group, GroupService, GroupListRequest } from '../group.service';
import { DataList } from 'app/shared/models';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css'],
})
export class GroupListComponent extends DataList<Group> {

  constructor(
    injector: Injector,
    protected service: GroupService,
  ) {
    super(injector, service);
    this.params = new GroupListRequest();
  }

}
