import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { DataList } from 'app/shared/models';
import { RoleService, RoleSearchParams, Role } from '../role.service';

@Component({
  selector: 'hq-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent extends DataList<any> implements OnInit {

  @ViewChild('createModal')
  private createModal: ModalDirective;
  @ViewChild('editModal')
  private editModal: ModalDirective;
  @ViewChild('allocateModal')
  private allocateModal: ModalDirective;
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

  private onWarehouseCreate(event) {
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

  private onEdit(model: Role) {
    this.role = model;
    this.editModal.show();
  }

  private onAllocate(model: Role) {
    this.role = model;
    this.allocateModal.show();
  }

}
