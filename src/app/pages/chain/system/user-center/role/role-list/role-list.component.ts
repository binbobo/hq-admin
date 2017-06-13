import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { DataList } from 'app/shared/models';
import { RoleService, RoleSearchParams, Role } from '../role.service';
import { HqModalDirective } from 'app/shared/directives';

@Component({
  selector: 'hq-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent extends DataList<any> implements OnInit {

  @ViewChild('createModal')
  private createModal: HqModalDirective;
  @ViewChild('editModal')
  private editModal: HqModalDirective;
  @ViewChild('allocateModal')
  private allocateModal: HqModalDirective;
  private tree: Array<any>;
  private role: Role;

  constructor(
    injector: Injector,
    private roleService: RoleService,
  ) {
    super(injector, roleService);
    this.params = new RoleSearchParams();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  private onRoleCreate(event) {
    this.createModal.hide();
    this.loadList();
  }

  private onRoleUpdate(event) {
    this.editModal.hide();
    this.loadList();
    this.role = null;
  }

  private onRoleAllocate() {
    this.role = null;
    this.allocateModal.hide();
  }

  private onEdit(event: Event, model: Role) {
    this.role = model;
    this.editModal.show();
  }

  private onAllocate(event: Event, model: Role) {
    this.role = model;
    this.allocateModal.show();
  }

}
