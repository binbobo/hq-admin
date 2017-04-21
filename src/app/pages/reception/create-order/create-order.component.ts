import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Component, Injector } from '@angular/core';
import { DataList } from '../../../shared/models/data-list';
import { OrderService, OrderListRequest, Order, Vehicle, MaintenanceItem, MaintenanceType, CustomerVehicle } from '../order.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';
import { ViewCell } from 'ng2-smart-table';
import { CustomMaintanceItemEditorComponent } from './custom-maintance-item-editor.component';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { StorageKeys } from '../../../shared/models/storage-keys';



@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css'],
})
export class CreateOrderComponent extends DataList<Order> {
  // 用于保存搜索框中输入的关键字
  private searchTerms: Subject<any> = new Subject<any>();

  // 车辆模糊查询  用于自动带出车型，车系，品牌信息
  // 结果数据集，
  public vehicles: Vehicle[];
  // 当前选择的车辆对象
  public selectedVehicle: Vehicle;

  // 生产工单按钮是否可用
  public enableCreateWorkSheet = false;

  // 客户车辆模糊查询  用于带出在本店维修过项目的客户车辆信息

  // 结果集
  public customerVehicles: CustomerVehicle[] = [];
  // 当前选择的客户车辆对象
  public selectedCustomerVehicle: CustomerVehicle = new CustomerVehicle();
  // 通过车牌号查询异步数据源
  public plateNoDataSource: Observable<CustomerVehicle>;
  // 通过车主姓名查询异步数据源
  public customerNameDataSource: Observable<CustomerVehicle>;


  // 维修类型数据
  public maintenanceTypeData: MaintenanceType[];


  // 挂起的工单
  public unsettledOrders; // Order[];
  // 当前正在编辑的工单
  public currentOrder: Order;


  // 创建工单表单FormGroup
  createWorkSheetForm: FormGroup;

  // 新增维修项目数据（临时保存）
  newMaintenanceItemData = [];

  // ng2-smart-table相关配置
  // 维修项目表头
  maintanceItemSettings = {
    columns: {
      serviceName: {
        title: '维修项目名称',
        type: 'html',
        editor: {
          type: 'custom',
          component: CustomMaintanceItemEditorComponent
        },
      },
      workHour: {
        title: '维修工时(小时)',
      },
      price: {
        title: '工时单价(元)'
      },
      money: {
        title: '金额(元)'  // 需要自己计算：工时 * 单价, 不需要传给后台
      },
      discount: {
        title: '折扣率(%)'
      },
      operationTime: {
        title: '操作时间', // 不需要传给后台
      }
    }
  };



  constructor(
    injector: Injector,
    protected service: OrderService,

    private fb: FormBuilder,
  ) {
    super(injector, service);
    this.params = new OrderListRequest();

    // 获取维修类型数据
    this.service.getMaintenanceTypes()
      .subscribe(data => this.maintenanceTypeData = data)

    // 构建表单
    this.createForm();

    // 获取挂起的订单
    this.unsettledOrders = this.getUnsettledOrders();

    // 表单域中的值改变事件监听
    this.createWorkSheetForm.valueChanges.subscribe(data => {
      // 只有表单域合法并且有新增维修项目数据的时候， 生成订单按钮才可用
      this.enableCreateWorkSheet = this.createWorkSheetForm.valid && this.newMaintenanceItemData.length > 0;
      console.log('表单域改变, 表单是否合法：', this.createWorkSheetForm.valid);
  });

    // 根据车牌号获取客户车辆信息数据源初始化
    this.plateNoDataSource = Observable
      .create((observer: any) => {
        observer.next(this.createWorkSheetForm.value.plateNo);
      })
      .debounceTime(300)
      .distinctUntilChanged()
      .mergeMap((token: string) => this.service.getCustomerVehicleByPlateNo(token))
      .catch(err => console.log(err));

    // 根据车主名称获取客户车辆信息数据源初始化
    this.customerNameDataSource = Observable
      .create((observer: any) => {
        observer.next(this.createWorkSheetForm.value.customerName);
      })
      .debounceTime(300)
      .distinctUntilChanged()
      .mergeMap((token: string) => this.service.getCustomerVehicleByCustomerName(token))
      .catch(err => console.log(err));
  }

  /**
   * @memberOf CreateOrderComponent
   */
  plateNoTypeaheadOnSelect(evt: TypeaheadMatch) {
    console.log('selected: ', evt);
    // 车牌号对应唯一客户车辆记录
    this.selectedCustomerVehicle = evt.item;
  }

  /**
  * @memberOf CreateOrderComponent
  */
  customerNameTypeaheadOnSelect(evt: TypeaheadMatch) {
    console.log('selected: ', evt);
    // 一个车主下面可能有多条客户车辆记录
    this.selectedCustomerVehicle = evt.item;
  }

  /**
   * 通过智能表格新增维修项目, 添加按钮点击事件处理程序
   * @memberOf CreateOrderComponent
   */
  addNewmaintanceItem(evt) {
    // 获取新增的维修工项记录
    const newData = evt.newData;
    console.log(newData);

    // 判断数据的合法性
    const isValid = true;

    if (isValid) {
      // 数据合法, 允许添加
      const confirm = evt.confirm;
      confirm.resolve();

      // 保存新增的维修项目
      this.newMaintenanceItemData.push({
        // serviceId
        serviceName: newData.serviceName,
        workHour: newData.workHour,
        price: newData.price,
        discount: newData.discount,
      });

      this.enableCreateWorkSheet =  this.createWorkSheetForm.valid;
    }
  }



  /**
  * 通过智能表格删除维修项目,事件处理程序
  * @memberOf CreateOrderComponent
  */
  deleteMaintanceItem(evt) {
    this.newMaintenanceItemData.forEach((item, index) => {
      if (evt.data.serviceName === item.serviceName) {
        // 将新增的维修项目从本地内存中移除
        this.newMaintenanceItemData.splice(index, 1);
        // 确认删除
        evt.confirm.resolve();

        // 如果新增项目为0 设置生成工单按钮不可用
        this.enableCreateWorkSheet = (this.newMaintenanceItemData.length > 0) && this.createWorkSheetForm.valid;
        console.log('添加维修项目, 是否存在维修项目：', this.newMaintenanceItemData.length);

        return;
      }
    });
  }

  // 获取挂单数据
  getUnsettledOrders() {
    return [{
      carOwner: '蛋蛋',
      carOwnerPhone: '13488618198',
      carNo: '京AH11P9'
    }, {
      carOwner: '池子',
      carOwnerPhone: '13488618198',
      carNo: 'AH11P9'
    }];
  }

  /**
   * 点击挂单列表的时候, 载入挂单信息
   * @memberOf CreateOrderComponent
   */
  loadUnsettledOrderInfo(order, pop) {
    // 隐藏popover
    pop.hide();
    console.log(order);
  }

  createForm() {
    this.createWorkSheetForm = this.fb.group({
      billCode: '', // 工单号
      customerName: [this.selectedCustomerVehicle.customerName, [Validators.required]], // 车主
      phone: [this.selectedCustomerVehicle.phone], // 车主电话
      createdOnUtc: '', // 进店时间 / 开单时间
      contactUser: ['', [Validators.required]], // 送修人
      contactInfo: ['', [Validators.required]], // 送修人电话
      createdUserName: '', // 服务顾问
      introducer: '', // 介绍人
      introPhone: '', // 介绍人电话
      brand: [this.selectedCustomerVehicle.brand, [Validators.required]], // 品牌
      series: [this.selectedCustomerVehicle.series, [Validators.required]], // 车系
      model: [this.selectedCustomerVehicle.model, [Validators.required]], // 车型
      plateNo: [this.selectedCustomerVehicle.plateNo, [Validators.required]], // 车牌号
      vin: [this.selectedCustomerVehicle.vin, [Validators.required]], // vin  底盘号
      validate: '', // 验车日期
      type: ['', [Validators.required]], // 维修类型
      expectLeave: ['', [Validators.required]], // 预计交车时间
      mileage: ['', [Validators.required]], // 行驶里程
      lastEnter: '', // 上次进店时间
      location: '', // 维修工位
      nextDate: '', // 建议下次保养日期
      lastMileage: '', // 上次进店里程
      nextMileage: '' // 建议下次保养里程
    });
  }

  // 创建工单按钮点击事件处理程序
  createWorkSheet() {
    // 组织接口参数
    // 1.表单基础数据 this.createWorkSheetForm.value
    const workSheet = this.createWorkSheetForm.value;
    // 2.新增维修项目数据 this.newMaintenanceItemData
    workSheet.maintenanceItems = this.newMaintenanceItemData;
    // 3. 当前登陆用户信息数据(操作员，组织id, ...)
    const user = sessionStorage.getItem(StorageKeys.Identity);
    workSheet.user = JSON.parse(user);
    // 调用创建工单接口

    console.log(workSheet);
    // this.service.create(workSheet);
  }
}
