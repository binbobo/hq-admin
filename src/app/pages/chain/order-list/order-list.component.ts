import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { DataList } from '../../../shared/models/data-list';
import { TreeviewItem, TreeviewConfig, DropdownTreeviewComponent } from 'ng2-dropdown-treeview';
import { OrderService, OrderListRequest, Order } from '../order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})

// 此处不能实现 OnInit 接口, 因为父类已经实现了该接口, 会从父类中继承过来
// 如果此处也实现 OnInit 接口（implements OnInit）, 会重写父类中的相应方法
export class OrderListComponent extends DataList<Order> {
  public dt: Date = new Date();
  public showDatePicker = false;

  public items: TreeviewItem[];
  public values: number[];
  public config: TreeviewConfig = {
    isShowAllCheckBox: true,
    isShowFilter: true,
    isShowCollapseExpand: true,
    maxHeight: 500
  };

  @ViewChild('dropdownTreeview')
  private dropdownTreeview: DropdownTreeviewComponent;

   constructor(
    injector: Injector,
    protected service: OrderService,
  ) {
    super(injector, service);
    this.params = new OrderListRequest();

    this.items = this.service.getSelectableStores();
  }


  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  onSelectedChange(dropdownTree) {
    console.log(dropdownTree);
      dropdownTree.treeviewComponent.checkedItems.forEach(
        treeviewItem => this.values += treeviewItem.text
      );
  }
}
