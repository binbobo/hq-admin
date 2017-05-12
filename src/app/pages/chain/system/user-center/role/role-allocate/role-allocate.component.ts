import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { Role, RoleService } from '../role.service';
import { TreeviewItem, TreeviewHelper, DownlineTreeviewItem, TreeviewComponent } from 'ngx-treeview';

@Component({
  selector: 'hq-role-allocate',
  templateUrl: './role-allocate.component.html',
  styleUrls: ['./role-allocate.component.css']
})
export class RoleAllocateComponent implements OnInit {

  @ViewChild(TreeviewComponent)
  private treeviewComponent: TreeviewComponent;
  @Output()
  private onSubmit = new EventEmitter();
  @Input()
  private model: Role;
  private items: TreeviewItem[] = [];
  private rows: string[];

  constructor(
    private roleService: RoleService
  ) { }

  getProducts(): TreeviewItem[] {
    const fruitCategory = new TreeviewItem({
      text: 'Fruit', value: 1, children: [
        { text: 'Apple', value: 11 },
        { text: 'Mango', value: 12 }
      ]
    });
    const vegetableCategory = new TreeviewItem({
      text: 'Vegetable', value: 2, children: [
        { text: 'Salad', value: 21 },
        { text: 'Potato', value: 22 }
      ]
    });
    vegetableCategory.children.push(new TreeviewItem({ text: 'Mushroom', value: 23, checked: false }));
    vegetableCategory.correctChecked(); // need this to make 'Vegetable' node to change checked value from true to false
    return [fruitCategory, vegetableCategory];
  }

  ngOnInit() {
    this.items = this.getProducts();
    if (this.model && this.model.id) {

    }
  }

  onItemCheckedChange(item: TreeviewItem) {
    console.log(item);
  }

  onSelectedChange(downlineItems: DownlineTreeviewItem[]) {
    console.log(downlineItems);
  }

  removeItem(item: TreeviewItem) {
    TreeviewHelper.removeItem(item, this.items);
    this.treeviewComponent.raiseSelectedChange();
  }

}
