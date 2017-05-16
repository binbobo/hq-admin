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
  private onSubmit = new EventEmitter();
  @Input()
  private model: Role;
  private items: Array<any> = [];
  private unCheckedList: Array<any> = [];

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

  onSelectedChange(downlineItems: DownlineTreeviewItem[]) {
    console.log(downlineItems);
  }

}
