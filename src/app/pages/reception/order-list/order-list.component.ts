import { Component, Injector } from '@angular/core';
import { DataList } from '../../../shared/models/data-list';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { OrderService, OrderListRequest, Order } from '../order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})

// 此处不能实现 OnInit 接口, 因为父类已经实现了该接口, 会从父类中继承过来
// 如果此处也实现 OnInit 接口（implements OnInit）, 会重写父类中的相应方法
export class OrderListComponent extends DataList<Order> {
  // 高级筛选条件面包是否折叠标志, 默认折叠
  public isCollapsed = true;

  // 用于ngx-treeview组件
  public items: TreeviewItem[];
  public config: TreeviewConfig = {
    isShowAllCheckBox: true,
    isShowFilter: true,
    isShowCollapseExpand: true,
    maxHeight: 500
  };

  // 当前选择的工单
  public selectedOrder: Order = null;



  // 表单
  workSheetFilterForm: FormGroup;

  constructor(
    injector: Injector,
    protected service: OrderService,

    private fb: FormBuilder
  ) {
    super(injector, service);
    this.params = new OrderListRequest();


    // 获取可以选择的店名, 用于查询范围筛选
    this.items = this.service.getSelectableStores();

    // 构建表单
    this.createForm();
  }

  createForm() {
    this.workSheetFilterForm = this.fb.group({
      toBeAssigned: '',
      toBeChecked: '',
      toBeBalanced: '',
      toBeCheckedOut: '',
      finished: '',
      all: '',
      plateNo: '', // 车牌号
      customerName: '', // 车主
      phone: '', // 车主电话
      contactUser: '', // 送修人
      contactInfo: '', // 送修人电话
      brand: '', // 品牌
      series: '', // 车系
      billCode: '', // 工单号
      createdUserName: '', // 服务顾问
      model: '', // 车型
      type: '', // 维修类型
      enterStoreTimeStart: '',
      enterStoreTimeEnd: '',
      leaveFactoryTimeStart: '',
      leaveFactoryTimeEnd: '',
    });
  }

  onSerarch() {
    // 获取表单数据
    const workSheetFilterFormModel = this.workSheetFilterForm.value;
    // 追加dropdown-treeview下

    console.log(workSheetFilterFormModel.value);
  }

  // 重置为初始查询条件
  revert() {
    this.workSheetFilterForm.reset();
  }
}
