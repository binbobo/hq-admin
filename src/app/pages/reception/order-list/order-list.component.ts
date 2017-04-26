import { Component, Injector } from '@angular/core';
import { DataList } from '../../../shared/models/data-list';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { OrderService, OrderListRequest, Order, MaintenanceType } from '../order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageKeys } from 'app/shared/models';

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

  // 当前选择的工单记录   用于查看工单详情  执行作废等功能
  selectedOrder = null;

  // 定义OrderListRequest类型的参数对象， 覆盖父类的
  params: OrderListRequest;

  // 当前登录用户信息
  public user = null;

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
      .subscribe(data => {
        this.orderStatusData = data;
        console.log('工单状态数据：', JSON.stringify(data));
      });
    // 获取可以选择的店名, 用于查询范围筛选
    this.service.getSelectableStores().subscribe(data => this.items = data);

    // 获取当前登录用户信息
    this.user = JSON.parse(sessionStorage.getItem(StorageKeys.Identity));
    console.log('当前登陆用户: ', this.user);

    // 构建表单
    this.createForm();
  }

  /**
   * 根据条件查询工单数据
   * @memberOf OrderListComponent
   */
  onSearch() {
    // 组织工单状态数据
    const checkedStatus = this.orderStatusData.filter(item => {
      return item.checked;
    });
    this.params.states = checkedStatus.map(item => item.id);

    console.log('当前选择的工单状态为：', this.params.states);

    // 执行查询
    this.onLoadList();
  }

  /**
   * 点击作废按钮处理程序
   * @param order
   */
  nullifyHandler(evt, id) {
    evt.preventDefault();

    this.service.delete(id).then(res => {
      console.log('根据工单id删除/作废工单：', res);

      // 重新加载页面
      this.onLoadList();
    });
  }

  /**
   * 点击工单详情按钮处理程序
   * @param {any} id 
   * @param {any} modalDialog 
   * 
   * @memberOf OrderListComponent
   */
  orderDetailsHandler(evt, id, modalDialog) {
    evt.preventDefault();

    // 根据id获取工单详细信息
    this.service.get(id).then(data => {
      console.log('根据工单id获取工单详情数据：', data);

      // 记录当前操作的工单记录
      this.selectedOrder = data;

      // 统计各项费用

      // 工时费： 维修项目金额总和
      this.selectedOrder.workHourFee = data.serviceOutputs.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.workHour * currentValue.price);
      }, 0);
      // 材料费： 维修配件金额总和
      this.selectedOrder.materialFee = data.productOutputs.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.count * currentValue.price);
      }, 0);
      // 其它费： 0
      this.selectedOrder.otherFee = 0;
      // 总计费： 
      this.selectedOrder.sumFee = this.selectedOrder.workHourFee + this.selectedOrder.materialFee + this.selectedOrder.otherFee;
      // 显示窗口
      modalDialog.show();
    });
  }

  createForm() {
    // 初始化数组类型参数
    this.params.states = [];
    this.params.orgIds = [];

    this.workSheetFilterForm = this.fb.group({
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
  onSearchRangeChange(evt) {
    // 更新查询范围参数
    this.params.orgIds = evt;

    console.log('当前选择的查询范围列表：', this.params.orgIds);

    // evt.map(item => this.params.orgIds.push(item));

    // console.log(this.params.orgIds)
  }

  // 重置为初始查询条件
  revert() {
    this.workSheetFilterForm.reset();

    this.params.states = [];
    this.params.orgIds = [];
  }
}
