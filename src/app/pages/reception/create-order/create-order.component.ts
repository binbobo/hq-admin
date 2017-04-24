import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Component, Injector, ViewChild, ElementRef } from '@angular/core';
import { DataList } from '../../../shared/models/data-list';
import { OrderService, OrderListRequest, Order, Vehicle, MaintenanceItem, MaintenanceType, CustomerVehicle } from '../order.service';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';
import { ViewCell } from 'ng2-smart-table';
import { CustomMaintanceItemEditorComponent } from './custom-maintance-item-editor.component';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { StorageKeys } from '../../../shared/models/storage-keys';

import * as moment from 'moment';


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
  // 当前选择的客户车辆对象
  public selectedCustomerVehicle: CustomerVehicle = new CustomerVehicle();
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
  // 当前选择的车型id
  public selectedModelId = null;


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

  // 费用计算相关
  workHourFee = 0;  // 工时费
  materialFee = 0; // 材料费
  otherFee = 0; // 其它
  sumFee = 0; // 总计

  // 当前登录用户信息
  private user = null;

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
    this.selectedModelId = evt.item.id;
  }

  /**
   * @memberOf CreateOrderComponent
   */
  plateNoOnSelect(evt: TypeaheadMatch) {
    console.log('selected: ', evt);
    // 车牌号对应唯一客户车辆记录
    this.selectedCustomerVehicle = evt.item;
    // 根据选择的车牌号带出客户车辆信息
    this.loadCustomerVehicleInfo(evt.item);
  }

  // 根据车牌号， 车主， vin 自动带出客户车辆信息
  loadCustomerVehicleInfo(customerVehicle) {
    this.workSheetForm.controls.plateNo.setValue(customerVehicle.plateNo);
    this.workSheetForm.controls.brand.setValue(customerVehicle.brand);
    this.workSheetForm.controls.customerName.setValue(customerVehicle.customer.name);
    this.workSheetForm.controls.phone.setValue(customerVehicle.customer.phone);
    this.workSheetForm.controls.vin.setValue(customerVehicle.vin);
    this.workSheetForm.controls.series.setValue(customerVehicle.series);
    this.workSheetForm.controls.lastEnter.setValue(moment(customerVehicle.lastEnter).format('YYYY-MM-DD hh:mm:ss'));
    this.workSheetForm.controls.model.setValue(customerVehicle.model);
    this.workSheetForm.controls.validate.setValue(moment(customerVehicle.validate).format('YYYY-MM-DD'));
  }

  /**
   * @memberOf CreateOrderComponent
   */
  vinOnSelect(evt: TypeaheadMatch) {
    console.log('selected: ', evt);
    // 车牌号对应唯一客户车辆记录
    this.selectedCustomerVehicle = evt.item;
  }

  /**
  * @memberOf CreateOrderComponent
  */
  customerNameOnSelect(evt: TypeaheadMatch) {
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

    // 报错错我信息
    let errorMsg = '';

    // 检查维修项目合法性
    if (!newData.serviceName) {
      errorMsg = '请选择一个维修项目';
      return;
    }

    // 浮点数正则表达式
    const reg = /^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/;
    // 检查工时合法性
    if (!newData.workHour || !reg.test(newData.workHour)) {
      errorMsg = '工时只能输入数字';
      return;
    }
    // 检查单价合法性
    if (!newData.price || !reg.test(newData.price)) {
      errorMsg = '单价只能输入数字';
      return;
    }
    // 检查折扣率合法性
    if (!newData.discount || !reg.test(newData.discount)) {
      errorMsg = '折扣率只能输入数字';
      return;
    }

    // 处理维修项目数据
    newData.serviceId = sessionStorage.getItem(StorageKeys.MaintanceItemId); // 维修项目id
    newData.money = newData.workHour * newData.price; // 金额 = 工时*单价
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
      customerName: [this.selectedCustomerVehicle.customerName, [Validators.required]], // 车主
      phone: [this.selectedCustomerVehicle.phone], // 车主电话
      createdOnUtc: [{ value: moment().format('YYYY-MM-DD hh:mm:ss'), disabled: true }], // 进店时间 / 开单时间
      contactUser: ['', [Validators.required]], // 送修人
      contactInfo: ['', [Validators.required]], // 送修人电话
      createdUserName: [{ value: this.user.username, disabled: true }], // 服务顾问
      introducer: '', // 介绍人
      introPhone: '', // 介绍人电话
      brand: [this.selectedCustomerVehicle.brand, [Validators.required]], // 品牌
      series: [{ value: this.selectedCustomerVehicle.series, disabled: true }, [Validators.required]], // 车系
      model: [{ value: this.selectedCustomerVehicle.model, disabled: true }, [Validators.required]], // 车型
      plateNo: [this.selectedCustomerVehicle.plateNo, [Validators.required]], // 车牌号
      vin: [this.selectedCustomerVehicle.vin, [Validators.required]], // vin  底盘号
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
    // 组织接口参数
    // 1.表单基础数据 this.workSheetForm.value
    const workSheet = this.workSheetForm.value;
    // 添加车型id 必填
    workSheet.vehicleId = this.selectedModelId;
    // 2.新增维修项目数据 this.newMaintenanceItemData
    workSheet.maintenanceItems = this.newMaintenanceItemData;

    // 3. 当前登陆用户信息数据(操作员，组织id, ...)
    workSheet.user = this.user;
    workSheet.orgId = '1941566D-0CED-46FC-A3E4-8A09507E3E3A';

    // 调用创建工单接口
    console.log('提交的工单对象： ', workSheet);
    this.service.create(workSheet).then(data => {
      console.log('创建工单成功之后， 返回的工单对象：', data);
      // 创建订单成功之后  表单重置，新增维修项目数据清空
      // this.workSheetForm.reset();
      // this.selectedBrandId = this.selectedSeriesId = null;
      // this.newMaintenanceItemData = [];
    }).catch(err => console.log(err));
  }
}
