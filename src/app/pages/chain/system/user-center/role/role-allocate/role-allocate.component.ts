import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { Role, RoleService } from '../role.service';
import { TreeviewItem, TreeviewHelper, DownlineTreeviewItem, TreeviewComponent, TreeItem } from 'ngx-treeview';
import { HqAlerter } from "app/shared/directives";

@Component({
  selector: 'hq-role-allocate',
  templateUrl: './role-allocate.component.html',
  styleUrls: ['./role-allocate.component.css']
})
export class RoleAllocateComponent implements OnInit {

  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @Output()
  private submit = new EventEmitter();
  @Output()
  private cancel = new EventEmitter();
  @Input()
  private model: Role;
  private items: Array<any> = [];
  private checkedList: Array<any> = [];

  constructor(
    private roleService: RoleService
  ) { }

  ngOnInit() {
    this.roleService.getMenus(this.model.id)
      .then(data => this.toTreeItem(data))
      .then(data => this.items = data)
      .catch(err => this.alerter.error(err));
  }

  toTreeItem(items: Array<any>) {
    return items.map(m => {
      if (m.children) {
        if (m.children.length == 0) {
          delete m.children;
        } else {
          m.children = this.toTreeItem(m.children);
        }
      }
      return new TreeviewItem(m);
    })
  }

  onSelectedChange(downlineItems) {
    this.checkedList = downlineItems;
  }

  onCancel() {
    this.cancel.emit();
  }

  getCheckedList(items: Array<any>) {
    let list = [];
    items.forEach(m => {
      if (this.checked(m)) {
        list.push(m.value);
      }
      if (Array.isArray(m.children)) {
        list = list.concat(this.getCheckedList(m.children));
      }
    })
    return list;
  }

  checked(item: any) {
    if (this.checkedList.includes(item.value)) return true;
    if (Array.isArray(item.children)) {
      return item.children.some(m => this.checked(m))
    } else {
      return false;
    }
  }

  onSubmit() {
    let list = this.getCheckedList(this.items);
    this.roleService.allocate(this.model.id, list)
      .then(() => this.submit.emit())
      .catch(err => this.alerter.error(err));
  }
}
