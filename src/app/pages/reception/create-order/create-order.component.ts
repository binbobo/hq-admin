import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Component, Injector, ViewChild, ElementRef } from '@angular/core';
import { DataList } from '../../../shared/models/data-list';
import { OrderService, OrderListRequest, Order, Vehicle, MaintenanceItem, MaintenanceType, CustomerVehicle, FuzzySearchRequest } from '../order.service';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';
import { ViewCell, LocalDataSource } from 'ng2-smart-table';
import { CustomMaintanceItemEditorComponent } from './custom-maintance-item-editor.component';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { StorageKeys } from '../../../shared/models/storage-keys';

import * as moment from 'moment';
import { TypeaheadRequestParams } from "app/shared/directives";


@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css'],
})
export class CreateOrderComponent extends DataList<Order> {

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
  // 上次维修工单信息
  public lastOrderData = null;
  // 通过车牌号查询异步数据源
  public plateNoDataSource: Observable<CustomerVehicle>;
  // 通过VIN查询异步数据源
  public vinDataSource: Observable<CustomerVehicle>;
  // 通过车主姓名查询异步数据源
  public customerNameDataSource: Observable<CustomerVehicle>;
  // 根据车型获取车辆信息异步数据源
  public vehicleDataSource: Observable<Vehicle>;
  // 根据品牌获取车辆信息异步数据源
  public brandDataSource: Observable<any>; // 可以加品牌model类：Brand
  // 根据车系获取车辆信息异步数据源
  public seriesDataSource: Observable<any>; // 可以加车系model类：Series
  // 根据车型获取车辆信息异步数据源
  public modelDataSource: Observable<any>; // 可以加车型model类：Model

  // 品牌是否选择标识, 用来记录当前选择的品牌id
  public selectedBrandId = null;
  // 车系是否选择标识, 用来记录当前选择的车系id
  public selectedSeriesId = null;
  // 当前选择的客户车辆记录
  private selectedCustomerVehicle = null;

  // 维修类型数据
  public maintenanceTypeData: MaintenanceType[];


  // 挂起的工单
  public unsettledOrders; // Order[];
  // 当前正在编辑的工单
  public currentOrder: Order;


  // 创建工单表单FormGroup
  workSheetForm: FormGroup;

  // 新增维修项目数据（临时保存）
  newMaintenanceItemData = [];

  stDataSource: LocalDataSource;

  // 费用计算相关
  workHourFee = 0;  // 工时费
  materialFee = 0; // 材料费
  otherFee = 0; // 其它
  sumFee = 0; // 总计

  // 当前登录用户信息
  public user = null;

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
        editable: false,
        title: '金额(元)'  // 需要自己计算：工时 * 单价, 不需要传给后台
      },
      discount: {
        title: '折扣率(%)'
      },
      operationTime: {
        editable: false,
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
      .subscribe(data => this.maintenanceTypeData = data);

    // 获取当前登录用户信息
    this.user = JSON.parse(sessionStorage.getItem(StorageKeys.Identity));
    console.log('当前登陆用户: ', this.user);

    // 构建表单
    this.createForm();

    // 初始化只能表单数据源
    this.stDataSource = new LocalDataSource();

    // 获取挂起的订单
    this.unsettledOrders = this.getUnsettledOrders();

    // 根据车牌号获取客户车辆信息数据源初始化
    this.plateNoDataSource = this.initFuzzySerarchDataSource(
      this.workSheetForm.controls.plateNo,
      this.service.getCustomerVehicleByPlateNoOrVin
    );
    // 根据VIN获取客户车辆信息数据源初始化
    this.vinDataSource = this.initFuzzySerarchDataSource(
      this.workSheetForm.controls.vin,
      this.service.getCustomerVehicleByPlateNoOrVin
    );
    // 根据车主名称获取客户车辆信息数据源初始化
    this.customerNameDataSource = this.initFuzzySerarchDataSource(
      this.workSheetForm.controls.customerName,
      this.service.getCustomerVehicleByCustomerName
    );
    // // 根据车型获取车辆信息异步数据源初始化
    this.vehicleDataSource = this.initFuzzySerarchDataSource(
      this.workSheetForm.controls.model,
      this.service.getVehicleByModel
    );
    // 根据品牌获取车辆信息异步数据源初始化
    this.brandDataSource = this.initFuzzySerarchDataSource(
      this.workSheetForm.controls.brand,
      this.service.getVehicleByBrand
    );
    // 根据车系获取车辆信息异步数据源初始化
    this.seriesDataSource = Observable
      .create((observer: any) => {
        observer.next(this.workSheetForm.controls.series.value);
      })
      .debounceTime(300)
      .distinctUntilChanged()
      .mergeMap((token: string) => this.service.getVehicleBySerias(token, this.selectedBrandId)) // 绑定this
      .catch(err => console.log(err));

    // 根据车系获取车辆信息异步数据源初始化
    this.modelDataSource = Observable
      .create((observer: any) => {
        observer.next(this.workSheetForm.controls.model.value);
      })
      .debounceTime(300)
      .distinctUntilChanged()
      .mergeMap((token: string) => this.service.getVehicleByModel(token, this.selectedBrandId, this.selectedSeriesId)) // 绑定this
      .catch(err => console.log(err));


    console.log('moment', moment());
  }

  /**
  * @param {string} nextValue
  * @param {Function} service
  * @returns
  * @memberOf CreateOrderComponent
  */
  initFuzzySerarchDataSource(formControl: AbstractControl, service: Function) {
    return Observable
      .create((observer: any) => {
        observer.next(formControl.value);
      })
      .debounceTime(300)
      .distinctUntilChanged()
      .mergeMap((token: string) => service.call(this.service, token)) // 绑定this
      .catch(err => console.log(err));
  }

  // 品牌输入框失去焦点事件监听
  onBrandBlur() {
    if (!this.selectedBrandId) {
      // 重置品牌输入框，只允许从下拉列表中选择
      this.workSheetForm.controls.brand.reset();
      this.selectedBrandId = null;
    }
  }
  // 从模糊查询下拉列表中选择一个品牌事件处理程序
  onBrandSelect(evt: TypeaheadMatch) {
    // 设置当前选择的品牌id
    this.selectedBrandId = evt.item.id;
    // enable车系选择
    this.workSheetForm.controls.series.enable();
  }

  // 车系输入框失去焦点事件监听
  onSeriesBlur() {
    if (!this.selectedSeriesId) {
      // 重置车系输入框，只允许从下拉列表中选择
      this.workSheetForm.controls.series.reset();
      this.selectedSeriesId = null;
    }
  }

  // 从模糊查询下拉列表中选择一个车系事件处理程序
  onSeriesSelect(evt: TypeaheadMatch) {
    // 设置当前选择的车系id
    this.selectedSeriesId = evt.item.id;
    // enable车型选择
    this.workSheetForm.controls.model.enable();
  }

  // 从模糊查询下拉列表中选择一个车型事件处理程序
  onModelSelect(evt: TypeaheadMatch) {
    // 设置当前选择的车系id
    console.log('选择车型', evt);

    // 如果手动选择了车型  以该车型id为准
    this.selectedCustomerVehicle.vehicleId = evt.item.id;
  }

  /**
   * @memberOf CreateOrderComponent
   */
  plateNoOnSelect(evt: TypeaheadMatch) {
    console.log('selected: ', JSON.stringify(evt.item));
    // 车牌号对应唯一客户车辆记录

    this.getLastOrderByCustomerVechileId(evt);
  }

  // 根据客户车辆Id查询上次工单信息
  getLastOrderByCustomerVechileId(evt) {
    this.service.getLastOrderInfo(evt.item.id).subscribe(lastOrder => {
      console.log('上次工单信息：', lastOrder);
      // 根据选择的车牌号带出客户车辆信息
      this.loadCustomerVehicleInfo(evt.item);
      if (lastOrder) {
        this.loadLastOrderInfo(lastOrder);
      }

      // 保存上次工单记录
      this.lastOrderData = lastOrder;
    });
  }

  // 根据车牌号， 车主， vin 自动带出客户车辆信息
  loadLastOrderInfo(lastOrder) {
    this.workSheetForm.controls.type.setValue(lastOrder.type);
    this.workSheetForm.controls.expectLeave.setValue(moment(lastOrder.expectLeave).format('YYYY-MM-DD hh:mm:ss'));
    this.workSheetForm.controls.lastEnter.setValue(moment(lastOrder.lastEnter).format('YYYY-MM-DD hh:mm:ss'));
    this.workSheetForm.controls.nextDate.setValue(moment(lastOrder.nextDate).format('YYYY-MM-DD'));
    this.workSheetForm.controls.location.setValue(lastOrder.location);
    this.workSheetForm.controls.mileage.setValue(lastOrder.mileage);
    this.workSheetForm.controls.lastMileage.setValue(lastOrder.mileage);
    this.workSheetForm.controls.nextMileage.setValue(lastOrder.nextMileage);
    this.workSheetForm.controls.validate.setValue(moment(lastOrder.validate).format('YYYY-MM-DD'));
  }

  // 根据车牌号， 车主， vin 自动带出客户车辆信息
  loadCustomerVehicleInfo(customerVehicle) {
    // 记录当前选择的车型Id
    this.selectedCustomerVehicle = customerVehicle;
    console.log('当前选中的车俩信息:', this.selectedCustomerVehicle);

    this.workSheetForm.controls.plateNo.setValue(customerVehicle.plateNo);
    this.workSheetForm.controls.brand.setValue(customerVehicle.brand);
    this.workSheetForm.controls.customerName.setValue(customerVehicle.customer.name);
    this.workSheetForm.controls.phone.setValue(customerVehicle.customer.phone);
    this.workSheetForm.controls.vin.setValue(customerVehicle.vin);
    this.workSheetForm.controls.series.setValue(customerVehicle.series);
    this.workSheetForm.controls.model.setValue(customerVehicle.model);
  }

  /**
   * @memberOf CreateOrderComponent
   */
  onVinSelect(evt: TypeaheadMatch) {
    console.log('selected: ', evt);
    // vin对应唯一客户车辆记录

    this.getLastOrderByCustomerVechileId(evt);
  }

  /**
  * @memberOf CreateOrderComponent
  */
  onCustomerNameSelect(evt: TypeaheadMatch) {
    console.log('selected: ', evt);
    // 一个车主下面可能有多条客户车辆记录

    this.getLastOrderByCustomerVechileId(evt);
  }

  /**
   * 通过智能表格新增维修项目, 添加按钮点击事件处理程序
   * @memberOf CreateOrderComponent
   */
  addNewmaintanceItem(evt) {
    // 获取新增的维修工项记录
    const newData = evt.newData;
    console.log(newData);

    // 检查维修项目合法性
    if (!newData.serviceName) {
      this.alerter.warn('请选择一个维修项目');
      return;
    }

    // 浮点数正则表达式
    const reg = /^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/;
    // 检查工时合法性
    if (!newData.workHour || !reg.test(newData.workHour)) {
      this.alerter.warn('工时只能输入数字');
      return;
    }
    // 检查单价合法性
    if (!newData.price || !reg.test(newData.price)) {
      this.alerter.warn('单价只能输入数字');
      return;
    }
    // 检查折扣率合法性
    if (!newData.discount || !/^[0-9][0-9]?$|^100$/.test(newData.discount)) {
      this.alerter.warn('折扣率只能0~100之间的整数');
      return;
    }

    // 处理维修项目数据
    newData.serviceId = sessionStorage.getItem(StorageKeys.MaintanceItemId); // 维修项目id
    newData.money = newData.workHour * newData.price * (1 - newData.discount / 100); // 金额 = 工时*单价
    newData.operationTime = moment().format('YYYY-MM-DD hh:mm:ss'); // 默认为当前时间
    newData.type = '1';  // 类型 1表示维修项目

    // 添加维修项目
    this.newMaintenanceItemData.push(newData);

    // 数据合法, 允许添加
    evt.confirm.resolve(newData);

    // 计算工时费
    this.workHourFee += newData.money;
    this.sumFee = this.workHourFee + this.materialFee + this.otherFee;

    // 判断生成工单按钮是否可用
    this.enableCreateWorkSheet = this.workSheetForm.valid;
  }

  /**
  * 通过智能表格删除维修项目,事件处理程序
  * @memberOf CreateOrderComponent
  */
  deleteMaintanceItem(evt) {
    // 确认删除
    evt.confirm.resolve();

    // 移除维修项目
    this.newMaintenanceItemData.forEach((item, index) => {
      if (evt.data.serviceName === item.serviceName) {
        // 将新增的维修项目从本地内存中移除
        this.newMaintenanceItemData.splice(index, 1);

        // 重新结算费用
        this.workHourFee -= item.workHour;
        this.sumFee -= this.workHourFee + this.materialFee + this.otherFee;

        console.log('删除之后的维修项目', this.newMaintenanceItemData);
        return;
      }
    });
    // 如果新增项目为0 设置生成工单按钮不可用
    this.enableCreateWorkSheet = (this.newMaintenanceItemData.length > 0) && this.workSheetForm.valid;
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
    this.workSheetForm = this.fb.group({
      billCode: '', // 工单号
      customerName: ['', [Validators.required]], // 车主
      phone: [''], // 车主电话
      createdOnUtc: [{ value: moment().format('YYYY-MM-DD hh:mm:ss'), disabled: true }], // 进店时间 / 开单时间
      contactUser: ['', [Validators.required]], // 送修人
      contactInfo: ['', [Validators.required]], // 送修人电话
      createdUserName: [{ value: this.user.username, disabled: true }], // 服务顾问
      introducer: '', // 介绍人
      introPhone: '', // 介绍人电话
      brand: ['', [Validators.required]], // 品牌
      series: [{ value: '', disabled: true }, [Validators.required]], // 车系
      model: [{ value: '', disabled: true }, [Validators.required]], // 车型
      plateNo: ['', [Validators.required]], // 车牌号
      vin: ['', [Validators.required]], // vin  底盘号
      validate: '', // 验车日期
      type: ['', [Validators.required]], // 维修类型
      expectLeave: ['', [Validators.required]], // 预计交车时间
      mileage: ['', [Validators.required]], // 行驶里程
      lastEnter: [{ value: '', disabled: true }], // 上次进店时间
      location: '', // 维修工位
      nextDate: '', // 建议下次保养日期
      lastMileage: [{ value: '', disabled: true }], // 上次进店里程
      nextMileage: '' // 建议下次保养里程
    });

    // 表单域中的值改变事件监听
    this.workSheetForm.valueChanges.subscribe(data => {
      // 只有表单域合法并且有新增维修项目数据的时候， 生成订单按钮才可用
      this.enableCreateWorkSheet = this.workSheetForm.valid && this.newMaintenanceItemData.length > 0;
      // console.log('表单域改变, 表单是否合法：', this.workSheetForm.valid);
    });

    // 品牌表单域值改变事件监听
    this.workSheetForm.controls.brand.valueChanges.subscribe((newValue) => {
      this.selectedBrandId = null;

      // 重置车系选择域
      this.workSheetForm.controls.series.reset();
      this.workSheetForm.controls.series.disable();
      this.selectedSeriesId = null;

      // 重置车型选择域
      this.workSheetForm.controls.model.reset();
      this.workSheetForm.controls.model.disable();
    });
    // 车系表单域值改变事件监听
    this.workSheetForm.controls.series.valueChanges.subscribe((newValue) => {
      this.selectedSeriesId = null;

      // 重置车型选择域
      this.workSheetForm.controls.model.reset();
      this.workSheetForm.controls.model.disable();
    });
    // 车型表单域值改变事件监听
    this.workSheetForm.controls.model.valueChanges.subscribe((newValue) => {
    });
  }

  // 创建工单按钮点击事件处理程序
  createWorkSheet() {
    // 设置按钮不可用
    // this.enableCreateWorkSheet = false;

    // 组织接口参数
    // 1.表单基础数据 this.workSheetForm.value
    const workSheet = this.workSheetForm.value;
    // 添加客户车辆id 客户id 必填
    if (this.selectedCustomerVehicle && this.selectedCustomerVehicle.id) {
      workSheet.customerVehicleId = this.selectedCustomerVehicle.id; // 有才传
    }
    if (this.selectedCustomerVehicle && this.selectedCustomerVehicle.id) {
      workSheet.customerId = this.selectedCustomerVehicle.customerId; // 有才传
    }
    workSheet.vehicleId = this.selectedCustomerVehicle.vehicleId; // 必传

    // 2.新增维修项目数据 this.newMaintenanceItemData
    workSheet.maintenanceItems = this.newMaintenanceItemData;

    // 3. 当前登陆用户信息数据(操作员，组织id, ...)
    // workSheet.user = this.user;
    workSheet.orgId = '53113BFB-D2CF-43A8-A0D0-C5B5A61D0C07';

    // 调用创建工单接口
    console.log('提交的工单对象： ', JSON.stringify(workSheet));

    this.service.create(workSheet).then(data => {
      console.log('创建工单成功之后， 返回的工单对象：', data);
      this.alerter.success('创建工单成功！');
      // 创建订单成功之后  做一些重置操作

      // 表单重置
      this.workSheetForm.reset();

      this.selectedBrandId = this.selectedSeriesId = null;
      // 新增维修项目数据清空
      this.stDataSource.load([]);
      this.newMaintenanceItemData = [];
      // 清空上次维修工单数据
      this.lastOrderData = [];
      // 清空智能表格中的数据
    }).catch(err => {
      console.log(err);
      // 出错的话  允许再次提交
      this.enableCreateWorkSheet = true;
    });
  }


  // 定义要显示的列
  // public get typeaheadColumns() {
  //   return [
  //     { name: 'plateNo', title: '车牌号' },
  //   ];
  // }
  // // 从模糊查询下拉框中选择一条记录
  // public onTypeaheadSelect($event) {
  //   alert(JSON.stringify($event));
  // }
  // // 设置数据源
  // public get typeaheadSource() {
  //   return (params: TypeaheadRequestParams) => {
  //     const p = new FuzzySearchRequest(params.text);
  //     p.setPage(params.pageIndex, params.pageSize);
  //     return this.service.getCustomerVehicleByPlateNoOrVin2(p);
  //   };
  // }
}
