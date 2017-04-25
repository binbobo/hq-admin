import { Component, Injector } from '@angular/core';
import { DataList } from '../../../shared/models/data-list';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { OrderService, OrderListRequest, Order, MaintenanceType } from '../order.service';
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

  // 维修类型数据
  public maintenanceTypeData: MaintenanceType[];
  // 工单状态数据
  public orderStatusData;

  // 表单
  workSheetFilterForm: FormGroup;

  // 定义OrderListRequest类型的参数对象， 覆盖父类的
  params: OrderListRequest;

  constructor(
    injector: Injector,
    protected service: OrderService,

    private fb: FormBuilder
  ) {
    super(injector, service);
    this.params = new OrderListRequest();

    // 获取维修类型数据
    this.service.getMaintenanceTypes()
      .subscribe(data => this.maintenanceTypeData = data);
    // 获取工单状态数据
    this.service.getOrderStatus()
      .subscribe(data => this.orderStatusData = data);
    // 获取可以选择的店名, 用于查询范围筛选
    this.service.getSelectableStores().subscribe(data => {
      this.items = data;
    });

    // 构建表单
    this.createForm();
  }

  createForm() {
    this.workSheetFilterForm = this.fb.group({
      unchecked: '', // 待验收
      unstarted: '', // 待开工
      started: '', // 已完工
      uncheckout: '', // 待收银
      assigned: '', // 已派工
      checked: '', // 已验收
      unassigned: '', // 未派工
      unsettlemented: '', // 待结算
      checkouted: '', // 已收银

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

  /**
   * 查询范围下拉框选择事件
   * @param {any} evt 
   * 
   * @memberOf OrderListComponent
   */
  onSelectedChange(evt) {
    console.log('当前选择的查询范围列表：', evt);
  }

  // 重置为初始查询条件
  revert() {
    this.workSheetFilterForm.reset();
  }
}
