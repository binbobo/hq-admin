import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Component, Injector, ViewChild, ElementRef, OnInit } from '@angular/core';
import { OrderService, OrderListRequest, Order, Vehicle, MaintenanceItem, MaintenanceType, CustomerVehicle, FuzzySearchRequest } from '../order.service';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';
import { ViewCell, LocalDataSource } from 'ng2-smart-table';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import * as moment from 'moment';
import { TypeaheadRequestParams } from 'app/shared/directives';
import { DataList, StorageKeys } from 'app/shared/models';


@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css'],
})
export class CreateOrderComponent extends DataList<Order> implements OnInit {
  // 车辆模糊查询  用于自动带出车型，车系，品牌信息
  // 结果数据集
  public vehicles: Vehicle[];
  // 当前选择的车辆对象
  public selectedVehicle: Vehicle;

  // 生产工单按钮是否可用
  public enableCreateWorkSheet = false;
  // 挂单按钮是否可用
  public enableSuspendWorkSheet = true;

  // 客户车辆模糊查询  用于带出在本店维修过项目的客户车辆信息

  // 结果集
  public customerVehicles: CustomerVehicle[] = [];
  // 上次维修工单信息
  public lastOrderData = null;

  // 根据品牌获取车辆信息异步数据源
  public brandDataSource: Observable<any>; // 可以加品牌model类：Brand
  // 根据车系获取车辆信息异步数据源
  public seriesDataSource: Observable<any>; // 可以加车系model类：Series
  // 根据车型获取车辆信息异步数据源
  public modelDataSource: Observable<any>; // 可以加车型model类：Model
  // 当前选择的维修项目id
  isMaintanceItemSelected = false;
  serviceSelected: string;

  // 当前选择的客户车辆记录
  private selectedCustomerVehicle: any = {};

  // 维修类型数据
  public maintenanceTypeData: MaintenanceType[];

  // 挂起的工单
  public suspendedOrders: any = []; // Order[];

  // 创建工单表单FormGroup
  workSheetForm: FormGroup;

  // 新增维修项目相关(不使用smart-table)
  addNewMaintenanceItem = false; // 维修项目编辑区域是否可见标志
  newMaintenanceItemData2 = []; // 保存所有添加的维修项目记录
  newMaintenanceItem = null; // 当前编辑的维修项目记录

  // 费用计算相关
  fee = {
    workHour: 0,
    material: 0,
    other: 0,
  };

  // 当前登录用户信息
  public user = null;

  // 覆盖父类的初始化方法
  ngOnInit() { }

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

    // 获取挂单列表数据
    this.getSuspendedOrders();

    // 构建表单
    this.createForm();

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
      .mergeMap((token: string) => {
        if (!token) {
          return Observable.of([]);
        }
        return this.service.getVehicleBySerias(token, this.selectedCustomerVehicle.selectedBrandId);
      }) // 绑定this
      .catch(err => console.log(err));

    // 根据车系获取车辆信息异步数据源初始化
    this.modelDataSource = Observable
      .create((observer: any) => {
        observer.next(this.workSheetForm.controls.model.value);
      })
      .debounceTime(300)
      .distinctUntilChanged()
      .mergeMap((token: string) => {
        if (!token) {
          return Observable.of([]);
        }
        return this.service.getVehicleByModel(token, this.selectedCustomerVehicle.selectedBrandId, this.selectedCustomerVehicle.selectedSeriesId)
      })
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
      .mergeMap((token: string) => {
        if (!token) {
          return Observable.of([]);
        }
        return service.call(this.service, token);
      }) // 绑定this
      .catch(err => console.log(err));
  }

  // 从模糊查询下拉列表中选择一个品牌事件处理程序
  onBrandSelect(evt: TypeaheadMatch) {
    // 设置当前选择的品牌id
    this.selectedCustomerVehicle.selectedBrandId = evt.item.id;
    // enable车系选择
    this.workSheetForm.controls.series.enable();
  }
  // 从模糊查询下拉列表中选择一个车系事件处理程序
  onSeriesSelect(evt: TypeaheadMatch) {
    // 设置当前选择的车系id
    this.selectedCustomerVehicle.selectedSeriesId = evt.item.id;
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


  // 根据客户车辆Id查询上次工单信息
  getLastOrderByCustomerVechileId(evt) {
    // 先清空上次工单数据  再查询新数据
    this.lastOrderData = null;

    if (!evt.id) {
      this.alerter.error('加载客户车辆信息失败！缺少客户车辆ID');
      return;
    }
    this.service.getLastOrderInfo(evt.id).subscribe(lastOrder => {
      console.log('根据客户车辆id自动带出的上次工单信息：', lastOrder);
      // 根据选择的车牌号带出客户车辆信息
      this.loadCustomerVehicleInfo(evt);

      // 判断是否有上次
      if (lastOrder) {
        this.loadLastOrderInfo(lastOrder);

        // 保存上次工单记录
        this.lastOrderData = lastOrder;
      }
    });
  }

  // 根据车牌号， 车主， vin 自动带出客户车辆信息
  loadLastOrderInfo(lastOrder) {
    // 格式化日期
    lastOrder.expectLeave = moment(lastOrder.expectLeave).format('YYYY-MM-DD hh:mm:ss');
    lastOrder.lastEnter = moment(lastOrder.lastEnter).format('YYYY-MM-DD hh:mm:ss');
    lastOrder.nextDate = moment(lastOrder.nextDate).format('YYYY-MM-DD');
    lastOrder.validate = moment(lastOrder.validate).format('YYYY-MM-DD');

    this.workSheetForm.patchValue(lastOrder);
  }

  // 根据车牌号， 车主， vin 自动带出客户车辆信息
  loadCustomerVehicleInfo(customerVehicle) {
    // 记录当前选择的客户车辆记录
    this.selectedCustomerVehicle = customerVehicle;
    // console.log('模糊查询后, 当前选中的客户车俩信息为:', customerVehicle); 有问题

    this.workSheetForm.patchValue(customerVehicle);
  }

  /**
   * 获取挂单列表数据
   * @private
   * @memberof CreateOrderComponent
   */
  private getSuspendedOrders() {
    // 先清空 再获取
    this.suspendedOrders = [];
    // 获取挂起的订单
    this.service.getSuspendedOrders().subscribe(data => {
      this.suspendedOrders = data.map(item => {
        const o = JSON.parse(item.data);
        o.suspendedBillId = item.id; // 挂单记录Id
        return o;
      });

      console.log('挂单列表数据', this.suspendedOrders);
    });
  }

  /**
  * @memberOf CreateOrderComponent
  */
  plateNoOnSelect(evt: TypeaheadMatch) {
    console.log('根据车牌号模糊查询客户车辆信息selected: ', JSON.stringify(evt));
    // 车牌号对应唯一客户车辆记录

    this.getLastOrderByCustomerVechileId(evt);
  }

  /**
  * @memberOf CreateOrderComponent
  */
  onCustomerNameSelect(evt: TypeaheadMatch) {
    console.log('根据车主姓名模糊查询客户车辆信息selected: ', JSON.stringify(evt.item));
    // 一个车主下面可能有多条客户车辆记录

    this.getLastOrderByCustomerVechileId(evt);
  }


  // 点击新增维修项目按钮 处理程序
  addNewmaintanceItem2() {
    // 初始化当前编辑的维修项目记录
    this.newMaintenanceItem = {
      type: 1, // type 1 表示维修项目
      serviceName: '',
      workHour: '',
      price: '',
      discount: 100,
      amount: '',
      operationTime: moment().format('YYYY-MM-DD hh:mm:ss')
    };
    // 维修项目编辑区域可见
    this.addNewMaintenanceItem = true;
  }
  // 确认添加一条维修项目记录 处理程序
  onConfirmAddNewMaintenanceItem(evt?: Event) {
    if (evt) {
      evt.preventDefault();
    }
    if (this.isWorkHourValid() && this.isPriceValid() && this.isDiscountValid()) {
      this.newMaintenanceItemData2.push(this.newMaintenanceItem);
      // 维修项目编辑区域不可见
      this.addNewMaintenanceItem = false;

      // 费用计算
      this.fee.workHour += parseFloat(this.newMaintenanceItem.amount) / 100;

      // 判断生成工单按钮是否可用
      this.enableCreateWorkSheet = this.workSheetForm.valid;
    } else {
      // 数据输入不合法
      this.alerter.error('数据输入不合法');
    }
  }
  // 从表格中删除一条添加的维修项目事件处理程序
  onDelNewMaintenanceItem(evt, serviceId) {
    evt.preventDefault();

    this.newMaintenanceItemData2.filter((item, index) => {
      if (item.serviceId === serviceId) {
        this.newMaintenanceItemData2.splice(index, 1);
        // 费用计算
        this.fee.workHour -= parseFloat(item.amount) / 100;
        // 如果新增项目为0 设置生成工单按钮不可用
        this.enableCreateWorkSheet = (this.newMaintenanceItemData2.length > 0) && this.workSheetForm.valid;
        return;
      }
    });

  }
  // 判断输入的工时是否合法
  private isWorkHourValid() {
    return /^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/.test(this.newMaintenanceItem.workHour);
  }
  // 判断输入的单价是否合法
  private isPriceValid() {
    return /^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/.test(this.newMaintenanceItem.price);
  }
  // 判断输入的折扣率是否合法
  private isDiscountValid() {
    return /^[0-9][0-9]?$|^100$/.test(this.newMaintenanceItem.discount);
  }
  // 维修项目输入框失去焦点事件处理程序
  onServiceBlur() {
    if (!this.newMaintenanceItem.serviceId) {
      this.newMaintenanceItem.serviceName = '';
      this.newMaintenanceItem.serviceId = '';
    }
    this.isMaintanceItemSelected = false;
  }
  // 维修项目输入框值改变事件处理程序
  onServiceChange() {
    if (!this.isMaintanceItemSelected) {
      this.newMaintenanceItem.serviceId = '';
    }
  }
  // 从下拉列表中选择一个维修项目事件处理程序
  serviceTypeaheadOnSelect(evt) {
    // 保存当前选择的维修项目名称
    this.newMaintenanceItem.serviceName = evt.name;
    // 保存当前选择的维修项目id
    this.newMaintenanceItem.serviceId = evt.id;
    // 设置维修项目是否已选择标识为true
    this.isMaintanceItemSelected = true;
  }
  // 工时输入框 输入监听
  onWorkHourChange() {
    // 检查工时合法性
    if (!this.isWorkHourValid()) {
      // this.alerter.warn('工时只能输入数字');
      this.newMaintenanceItem.workHour = '';
      this.newMaintenanceItem.amount = '';
    }
    this.calMoney();
  }

  /**
   * 挂单处理程序
   * @memberof CreateOrderComponent
   */
  suspendOrder() {
    // 挂单按钮不可用  防止重复提交
    this.enableSuspendWorkSheet = false;

    // 获取当前录入的工单数据
    const workSheet = this.getEdittingOrder();
    const suspendedOrder: any = {
      type: '01', // 挂起单据类型 01：维修工单 02：销售单
      data: JSON.stringify(workSheet)
    };

    console.log('提交的挂单数据为：', JSON.stringify(suspendedOrder));
    // 修改挂单记录信息
    if (workSheet.suspendedBillId) {
      suspendedOrder.suspendedBillId = workSheet.suspendedBillId;

      this.service.updateSuspendOrder(suspendedOrder).then(() => {
        console.log('更新挂单记录成功啦');
        this.alerter.success('挂起工单成功！');
        this.enableSuspendWorkSheet = true;

        // 重新获取挂单列表
        this.getSuspendedOrders();

        // 清空数据
        this.initOrderData();
      }).catch(err => {
        console.log('挂起工单失败：' + err);
        // 出错的话  允许再次挂单
        this.enableSuspendWorkSheet = true;

        this.alerter.error('挂起工单失败');
      });
    } else {
      // 添加挂单
      this.service.suspend(suspendedOrder).then((data) => {
        // console.log('挂起工单成功之后， 返回的工单对象：', data);
        this.alerter.success('挂起工单成功！');
        this.enableSuspendWorkSheet = true;

        // 重新获取挂单列表
        this.getSuspendedOrders();

        // 清空数据
        this.initOrderData();
      }).catch(err => {
        console.log('挂起工单失败：' + err);
        // 出错的话  允许再次挂单
        this.enableSuspendWorkSheet = true;

        this.alerter.error('挂起工单失败');
      });
    }
  }

  // 单价输入框 输入监听
  onPriceChange() {
    // 检查单价合法性
    if (!this.isPriceValid()) {
      // this.alerter.warn('单价只能输入数字');
      this.newMaintenanceItem.price = '';
      this.newMaintenanceItem.amount = '';
    }

    this.calMoney();
  }
  // 折扣率输入框 输入监听
  onDiscountChange() {
    // 检查折扣率合法性
    if (!this.isDiscountValid()) {
      // this.alerter.warn('折扣率只能0~100之间的整数');
      this.newMaintenanceItem.discount = '';
    }
    this.calMoney();
  }
  /**
   * 计算金额 工时*单价*折扣率
   */
  calMoney() {
    if (this.isWorkHourValid() && this.isPriceValid()) {
      this.newMaintenanceItem.amount = this.newMaintenanceItem.workHour * this.newMaintenanceItem.price;
      if (this.isDiscountValid()) {
        const discountRatio = this.newMaintenanceItem.discount / 100;
        this.newMaintenanceItem.amount = this.newMaintenanceItem.amount * discountRatio;
      }
      this.newMaintenanceItem.amount = this.newMaintenanceItem.amount.toFixed(2) * 100; // 转成分
    }
  }


  // 获取挂单数据
  // getUnsettledOrders() {
  //   return [{
  //     carOwner: '蛋蛋',
  //     carOwnerPhone: '13488618198',
  //     carNo: '京AH11P9'
  //   }, {
  //     carOwner: '池子',
  //     carOwnerPhone: '13488618198',
  //     carNo: 'AH11P9'
  //   }];
  // }

  /**
   * 点击挂单列表的时候, 载入挂单信息
   * @memberOf CreateOrderComponent
   */
  loadSuspendedOrderInfo(evt, order, pop) {
    if (evt.target.tagName === 'BUTTON' || evt.target.tagName === 'I') {
      // 点击的删除按钮
      // 提示是否删除当前挂单信息

      // 获取挂单id
      const suspendedBillId = order.suspendedBillId;
      if (!suspendedBillId) {
        console.log('获取挂单id失败！');
        return;
      }
      // 根据id删除挂单记录
      this.service.deleteSuspendOrder(suspendedBillId).then(() => {
        this.alerter.success('删除挂单记录成功');

        // 获取挂单列表数据
        this.getSuspendedOrders();
      }).catch(err => this.alerter.error('删除挂单记录失败：' + err));
    } else {
      // 隐藏popover
      pop.hide();

      console.log('当前选择的挂掉记录为：', order);
      // 表单赋值
      this.workSheetForm.patchValue(order);

      // 计算费用
      this.fee.workHour = order.maintenanceItems.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.amount / 100;
      }, 0);

      // 需要深copy order对象  不能改变原对象 
      // 因为每次选择一个挂掉的时候，挂单记录不会从列表中消失 只有点击创建工单之后  才消失
      const copiedOrder = Object.assign({}, order);
      copiedOrder.maintenanceItems = this.deepCopyArray(order.maintenanceItems);

      // 记录当前选择的挂单
      this.selectedCustomerVehicle = copiedOrder;
      // 设置维修项目数据
      this.newMaintenanceItemData2 = copiedOrder.maintenanceItems;

      // 判断生成工单按钮是否可用
      this.enableCreateWorkSheet = this.workSheetForm.valid && this.newMaintenanceItemData2.length > 0;
    }
  }

  // 深拷贝 数组
  private deepCopyArray(srcArr) {
    const arr = [];
    srcArr.forEach((item) => {
      arr.push(Object.assign({}, item));
    });
    return arr;
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
      this.enableCreateWorkSheet = this.workSheetForm.valid && this.newMaintenanceItemData2.length > 0;
      // console.log('表单域改变, 表单是否合法：', this.workSheetForm.valid);
    });

    // 品牌表单域值改变事件监听
    this.workSheetForm.controls.brand.valueChanges.subscribe((newValue) => {
      // 设置当前选择的品牌id为null
      this.selectedCustomerVehicle.selectedBrandId = null;

      // 重置车系选择域
      this.workSheetForm.controls.series.reset();
      this.workSheetForm.controls.series.disable();
      // 设置当前选择的车系id为null
      this.selectedCustomerVehicle.selectedSeriesId = null;

      // 重置车型选择域
      this.workSheetForm.controls.model.reset();
      this.workSheetForm.controls.model.disable();
    });
    // 车系表单域值改变事件监听
    this.workSheetForm.controls.series.valueChanges.subscribe((newValue) => {
      // 设置当前选择的车系id为null
      this.selectedCustomerVehicle.selectedSeriesId = null;

      // 重置车型选择域
      this.workSheetForm.controls.model.reset();
      this.workSheetForm.controls.model.disable();
    });
    // 车型表单域值改变事件监听
    this.workSheetForm.controls.model.valueChanges.subscribe((newValue) => {
      // 设置当前选择的车型id为null
      // this.selectedCustomerVehicle.vehicleId = null;
    });
  }

  /**
   * 获取当前正在编辑的工单信息
   */
  private getEdittingOrder() {

    // 组织接口参数
    // 1.表单基础数据 this.workSheetForm.value
    const workSheet = this.workSheetForm.value;

    // 判断是否存在客户车辆id
    if (this.selectedCustomerVehicle.id) {
      workSheet.customerVehicleId = this.selectedCustomerVehicle.id; // 有才传 (只有从模糊查询结果集中选择时才有值)
    }
    // 判断是否存在客户id
    if (this.selectedCustomerVehicle.customerId) {
      workSheet.customerId = this.selectedCustomerVehicle.customerId; // 有才传  (只有从模糊查询结果集中选择时才有值)
    }
    // 添加车型id
    workSheet.vehicleId = this.selectedCustomerVehicle.vehicleId; // 必传 (从模糊查询结果集中选择或者手动选择车型)

    // 2.新增维修项目数据 this.newMaintenanceItemData
    workSheet.maintenanceItems = this.newMaintenanceItemData2;

    // 3. 当前登陆用户信息数据(操作员，组织id, ...)
    workSheet.orgId = '53113BFB-D2CF-43A8-A0D0-C5B5A61D0C07';

    // 判断是否有挂单id
    if (this.selectedCustomerVehicle.suspendedBillId) {
      workSheet.suspendedBillId = this.selectedCustomerVehicle.suspendedBillId;
    }

    return workSheet;
  }

  /**
   * 初始化工单数据  用于新建和挂单
   * @memberof CreateOrderComponent
   */
  initOrderData() {
    // 表单重置
    this.workSheetForm.reset({
      // 初始化开单时间和服务顾问
      createdOnUtc: { value: moment().format('YYYY-MM-DD hh:mm:ss'), disabled: true },
      createdUserName: this.user.username
    });
    // 清空客户车辆信息数据   上次选择的品牌id和车系id,车型id
    this.selectedCustomerVehicle = {};
    // 清空新增维修项目数据
    this.newMaintenanceItemData2 = [];

    // 重置费用
    this.fee.workHour = 0;
    this.fee.material = 0;
    this.fee.other = 0;

    // 清空上次维修工单数据
    this.lastOrderData = null;
  }

  // 创建工单按钮点击事件处理程序
  createWorkSheet() {
    // 设置创建工单按钮不可用
    this.enableCreateWorkSheet = false;
    // 获取当前录入的工单信息
    const workSheet = this.getEdittingOrder();

    // 调用创建工单接口
    console.log('提交的工单对象： ', JSON.stringify(workSheet));

    this.service.create(workSheet).then(data => {
      // console.log('创建工单成功之后， 返回的工单对象：', data);
      this.alerter.success('创建工单成功！');
      // 创建订单成功之后  做一些重置操作

      // 清空数据
      this.initOrderData();

      // 如果是从挂单列表中选择的挂单记录  刷新挂单列表
      if (workSheet.suspendedBillId) {
        this.getSuspendedOrders();
      }
    }).catch(err => {
      console.log('创建工单失败：' + err);
      // 出错的话  允许再次提交
      this.enableCreateWorkSheet = true;

      this.alerter.error('创建工单失败');
    });
  }


  // 定义要显示的列
  public get typeaheadColumns() {
    return [
      { name: 'plateNo', title: '车牌号' },
      { name: 'customerName', title: '车主' },
      { name: 'phone', title: '车主电话' },
    ];
  }
  // 定义维修项目模糊查询要显示的列
  public get serviceNameTypeaheadColumns() {
    return [
      { name: 'name', title: '维修项目名称' },
    ];
  }
  // 设置数据源
  private typeaheadSource(service) {
    return (params: TypeaheadRequestParams) => {
      const p = new FuzzySearchRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return service.call(this.service, p);
    };
  }
  // 根据车牌号模糊查询数据源
  public get plateNotypeaheadSource() {
    return this.typeaheadSource(this.service.getCustomerVehicleByPlateNo);
  }
  // 根据车主姓名模糊查询数据源
  public get customerNametypeaheadSource() {
    return this.typeaheadSource(this.service.getCustomerVehicleByCustomerName);
  }
  // 根据维修项目名称模糊查询数据源
  public get serviceNametypeaheadSource() {
    return this.typeaheadSource(this.service.getMaintenanceItemsByName);
  }
}
