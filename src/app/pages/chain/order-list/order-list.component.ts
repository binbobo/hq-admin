import { Component, Injector } from '@angular/core';
import { DataList } from '../../../shared/models/data-list';
import { TreeviewItem, TreeviewConfig } from 'ng2-dropdown-treeview';
import { OrderService, OrderListRequest, Order } from '../order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})

// 此处不能实现 OnInit 接口, 因为父类已经实现了该接口, 会从父类中继承过来
// 如果此处也实现 OnInit 接口（implements OnInit）, 会重写父类中的相应方法
export class OrderListComponent extends DataList<Order> {
  // 用于日期组件
  public dt: Date = new Date();
  public showDatePicker = false;

  // 用于ng2-dropdown-treeview组件
  public items: TreeviewItem[];
  public config: TreeviewConfig = {
    isShowAllCheckBox: true,
    isShowFilter: true,
    isShowCollapseExpand: true,
    maxHeight: 500
  };



   constructor(
    injector: Injector,
    protected service: OrderService,
  ) {
    super(injector, service);
    this.params = new OrderListRequest();

    // 获取可以选择的店名, 用于查询范围筛选
    this.items = this.service.getSelectableStores();
  }

  // 切换是否显示日期组件标志
  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }
}
