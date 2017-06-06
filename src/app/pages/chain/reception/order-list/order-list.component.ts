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

  // ngx-treeview组件 参数配置 数据组织
  // public items: TreeviewItem[];
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

  generating = false;

  @ViewChild('printer')
  public printer: PrintDirective;

  // 结束时间参数对象
  endDateParams = {
    leaveEndTimeDate: undefined,
    enterEndTimeDate: undefined
  }

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
      });
    // 获取可以选择的店名, 用于查询范围筛选
    // this.service.getSelectableStores().subscribe(data => this.items = data);
    this.reset();
  }

  /**
   * 根据条件查询工单数据
   * @memberOf OrderListComponent
   */
  onSearch() {
    // 组织工单状态数据
    this.params.states = this.orderStatusData.filter(item => item.checked).map(item => item.id);
    // 处理时间
    if (this.endDateParams.enterEndTimeDate)
      this.params.enterEndTimeDate = this.endDateParams.enterEndTimeDate + ':59.999';
    if (this.endDateParams.leaveEndTimeDate)
      this.params.leaveEndTimeDate = this.endDateParams.leaveEndTimeDate + ':59.999';
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
      this.alerter.success('执行作废操作成功');

      // 重新加载页面
      this.onLoadList();
    });
  }

  print() {
    this.generating = true;
    // 记录打印时间
    this.selectedOrder.printDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    setTimeout(() => {
      this.generating = false;
      this.printer.print();
    }, 500);
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
      // 记录当前操作的工单记录
      this.selectedOrder = data;
      this.selectedOrder.id = id;

      this.service.getSettlements(id).then(feeData => {
        console.log('各项费用数据：', feeData);
        // 统计各项费用
        const fee: any = {};
        // 工时合计  临时放在fee下面 以后都通过接口获取
        fee.workHours = this.selectedOrder.serviceOutputs.reduce((accumulator, currentValue) => {
          return accumulator + currentValue.workHour;
        }, 0);
        // 工时费： 维修项目金额总和
        fee.workHour = feeData.workHourCost;
        // 材料费： 维修配件金额总和
        fee.material = feeData.materialCost;
        // 优惠：维修项目有折扣 + 结算抹零
        fee.discount = feeData.deduceAmount;
        //实收金额
        fee.amount = feeData.amount;

        this.selectedOrder.fee = fee;
        // 维修项目费用
        this.selectedOrder.serviceOutputs.fee = fee;
        // 材料费
        if (data.productOutputs && data.productOutputs.length > 0) {
          this.selectedOrder.productOutputs.fee = fee.material;
        }

        item.generating = false;
        // 显示窗口
        modalDialog.show();
      }).catch(err => {
        this.alerter.error(err, true, 2000);
        item.generating = false;
      })
    }).catch(err => {
      this.alerter.error(err, true, 2000);
      item.generating = false;
    });
  }

  // 导出工单列表数据

  // 导出当前查询条件下的车主信息
  export() {
    this.generating = true;
    this.service.export(this.params).then(() => {
      this.alerter.success('导出工单列表数据成功！');
      this.generating = false;
    }).catch(err => {
      this.generating = false;
      this.alerter.error('导出工单列表失败：' + err, true, 3000);
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

    // console.log('当前选择的查询范围列表：', this.params.orgIds);
  }


  // 时间选择限制  ngui-date-timer的值类型为： moment().toDate()   看源码可知
  public get maxLeaveStartDate() {
    return !!this.endDateParams.leaveEndTimeDate ? this.endDateParams.leaveEndTimeDate : moment().toDate()
  }
  public get minLeaveEndDate() {
    if(this.params.leaveStartTimeDate) {
      // ngui-date-timer [min-date] 不包含指定的值,所以需要在指定的值的基础上减1
      return moment(this.params.leaveStartTimeDate).subtract(1, 'd').toDate();
    }
    return '';
  }
  public get maxLeaveEndDate() {
    return moment().toDate();
  }
  public get maxEnterStartDate() {
    return !!this.endDateParams.enterEndTimeDate ? this.endDateParams.enterEndTimeDate : moment().toDate();
  }
  public get minEnterEndDate() {
      if(this.params.enterStartTimeDate) {
      return moment(this.params.enterStartTimeDate).subtract(1, 'd').toDate();
    }
    return '';
  }
  public get maxEnterEndDate() {
    return moment().toDate();
  }


  // 重置为初始查询条件
  reset() {
    this.params.states = [];
    this.params.orgIds = [];
  }

}
