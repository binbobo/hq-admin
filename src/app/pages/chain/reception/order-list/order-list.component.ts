import { Component, Injector, ViewChild } from '@angular/core';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';
import { OrderService, OrderListRequest, Order, MaintenanceType } from '../order.service';
import { Validators, NgForm } from '@angular/forms';
import { StorageKeys, DataList } from 'app/shared/models';
import { PrintDirective } from 'app/shared/directives';
import * as moment from 'moment';

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

  // 当前选择的工单记录   用于查看工单详情  执行作废等功能
  selectedOrder = null;

  // 定义OrderListRequest类型的参数对 象， 覆盖父类的
  params: OrderListRequest;

  // 当前登录用户信息
  public user = null;

  @ViewChild('printer')
  public printer: PrintDirective;

  constructor(
    injector: Injector,
    protected service: OrderService,
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
    //
    this.reset();
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

      this.alerter.success('执行作废操作成功');

      // 重新加载页面
      this.onLoadList();
    });
  }

  print() {
    this.printer.print();
  }

  /**
   * 点击工单详情按钮处理程序
   * @param {any} item 
   * @param {any} modalDialog 
   * 
   * @memberOf OrderListComponent
   */
  orderDetailsHandler(item, modalDialog) {
    item.generating = true;

    const id = item.id;
    // 根据id获取工单详细信息
    this.service.get(id).then(data => {
      console.log('根据工单id获取工单详情数据：', data);

      // 记录当前操作的工单记录
      this.selectedOrder = data;
      this.selectedOrder.id = id;

      // 统计各项费用
      this.selectedOrder.fee = {};
      // 工时费： 维修项目金额总和
      this.selectedOrder.fee.workHour = data.serviceOutputs.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.price * currentValue.workHour;
      }, 0);
      // 材料费： 维修配件金额总和
      this.selectedOrder.fee.material = data.productOutputs.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.price * currentValue.count;
      }, 0);
      // 其它费： 0
      this.selectedOrder.fee.other = 0;
      // 折扣费：目前只有维修项目有折扣
      this.selectedOrder.fee.discount = this.selectedOrder.fee.workHour - data.serviceOutputs.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.amount;
      }, 0);

      item.generating = false;
      // 显示窗口
      modalDialog.show();
    }).catch(err => {
      this.alerter.error('获取工单信息失败: ' + err, true, 2000);
      item.generating = false;
    });
  }

  // 导出工单列表数据

  // 导出当前查询条件下的车主信息
  export() {
    this.service.export(this.params).then(() => {
      console.log('导出工单列表数据成功！');
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
  }


  // 时间选择限制
  public get maxLeaveStartDate() {
    return this.params.leaveEndTimeDate || moment().format('YYYY-MM-DD');
  }
  public get minLeaveEndDate() {
    return this.params.leaveStartTimeDate || '';
  }
  public get maxLeaveEndDate() {
    return moment().format('YYYY-MM-DD');
  }
  public get maxEnterStartDate() {
    return this.params.enterEndTimeDate || moment().format('YYYY-MM-DD');
  }
  public get minEnterEndDate() {
    return this.params.enterStartTimeDate || '';
  }
  public get maxEnterEndDate() {
    return moment().format('YYYY-MM-DD');
  }


  // 重置为初始查询条件
  reset(form?: NgForm) {
    if (form) {
      form.reset();
    }

    this.params.states = [];
    this.params.orgIds = [];
  }

}
