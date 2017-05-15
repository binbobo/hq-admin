import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { OrderService, OrderListRequest, Order, Vehicle, MaintenanceItem, MaintenanceType, CustomerVehicle, FuzzySearchRequest, VehicleSeriesSearchRequest, VehicleBrandSearchRequest, VehicleSearchRequest } from '../order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';
import * as moment from 'moment';
import { TypeaheadRequestParams } from 'app/shared/directives';
import { DataList, StorageKeys } from 'app/shared/models';
import { SuspendBillDirective } from 'app/pages/chain/chain-shared';


@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css'],
})
export class CreateOrderComponent extends DataList<Order> implements OnInit {
  // 车辆模糊查询  用于自动带出车型，车系，品牌信息
  isSelected = false; // 标志是否是根据车牌号或者车主或者挂单列表中选择的

  // 生产工单按钮是否可用
  public enableCreateWorkSheet = false;
  // 挂单按钮是否可用
  public enableSuspendWorkSheet = true;

  @ViewChild(SuspendBillDirective)
  private suspendBill: SuspendBillDirective;

  // 上次维修工单信息
  public lastOrderData = null;

  // 维修类型数据
  public maintenanceTypeData: MaintenanceType[];
  // 创建工单表单FormGroup
  workSheetForm: FormGroup;
  serviceForm: FormGroup;
  workHourForm: FormGroup;
  workHourPriceForm: FormGroup;
  discountRatioForm: FormGroup;

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
    // console.log('当前登陆用户: ', this.user);

    // 构建表单
    this.createForm();
  }

  // 从模糊查询下拉列表中选择一个品牌事件处理程序
  onBrandSelect(evt) {
    // 设置当前选择的品牌id
    this.workSheetForm.controls.brandId.setValue(evt.id);
    this.workSheetForm.controls.brand.patchValue(evt.name, { emitEvent: false });
    // enable车系选择
    this.workSheetForm.controls.series.enable();
  }
  // 从模糊查询下拉列表中选择一个车系事件处理程序
  onSeriesSelect(evt) {
    // 设置当前选择的车系id
    this.workSheetForm.controls.seriesId.setValue(evt.id);
    this.workSheetForm.controls.series.patchValue(evt.name, { emitEvent: false });
    // enable车型选择
    this.workSheetForm.controls.vehicleName.enable();
  }

  // 从模糊查询下拉列表中选择一个车型事件处理程序
  onModelSelect(evt) {
    // 设置当前选择的车系id
    // console.log('车型选择:', evt);

    // 如果手动选择了车型  以该车型id为准
    this.workSheetForm.controls.vehicleId.setValue(evt.id);
    this.workSheetForm.controls.vehicleName.patchValue(evt.name, { emitEvent: false });
  }


  // 根据客户车辆Id查询上次工单信息
  getLastOrderByCustomerVechileId(evt) {
    // 先清空上次工单数据  再查询新数据
    this.lastOrderData = null;

    // 记录客户车辆id
    evt.customerVehicleId = evt.id;
    // 根据选择的车牌号带出客户车辆信息
    this.loadCustomerVehicleInfo(evt);

    // 客户车辆相关信息不可编辑
    this.disableCustomerVehicleField();

    if (!evt.id) {
      this.alerter.error('加载上次工单信息失败！缺少客户车辆ID');
      return;
    }

    // 根据客户车辆id查询上次工单信息
    this.service.getLastOrderInfo(evt.id).then(lastOrder => {
      // console.log('根据客户车辆id自动带出的上次工单信息：', lastOrder);
      // 判断是否有上次历史工单记录
      if (lastOrder) {
        this.loadLastOrderInfo(lastOrder);
        // 保存上次工单记录
        this.lastOrderData = lastOrder;
        // 设置选择为true
        this.isSelected = true;
      }
    }).catch(err => {
      // 没有上次工单记录  或者  接口出错
      // this.alerter.error('获取上次工单信息失败：' + err);

      this.isSelected = true;
    });
  }

  // 根据车牌号， 车主， vin 自动带出客户车辆信息
  loadLastOrderInfo(lastOrder) {
    // 加载上次工单信息
    this.workSheetForm.patchValue({
      type: lastOrder.type,
      contactUser: lastOrder.contactUser,
      contactInfo: lastOrder.contactInfo,
      mileage: lastOrder.mileage,
      introducer: lastOrder.introducer,
      introintroPhoneducer: lastOrder.introPhone,
      validate: moment(lastOrder.validate).format('YYYY-MM-DD'),
      location: lastOrder.location,
      lastEnter: moment(lastOrder.lastEnter).format('YYYY-MM-DD hh:mm:ss'),
      lastMileage: lastOrder.lastMileage,
    });
  }

  // 根据车牌号， 车主， vin 自动带出客户车辆信息
  loadCustomerVehicleInfo(customerVehicle) {
    console.log('客户车辆信息', customerVehicle);
    // 加载客户车辆信息
    this.workSheetForm.patchValue({
      plateNo: customerVehicle.plateNo,
      customerName: customerVehicle.customerName,
      phone: customerVehicle.phone,
      vin: customerVehicle.vin,
      brand: customerVehicle.brand,
      brandId: customerVehicle.brandId,
      series: customerVehicle.series,
      seriesId: customerVehicle.seriesId,
      vehicleName: customerVehicle.vehicleName,
      vehicleId: customerVehicle.vehicleId,

      customerVehicleId: customerVehicle.id,
      customerId: customerVehicle.customerId,
    });
  }

  /**
  * @memberOf CreateOrderComponent
  */
  plateNoOnSelect(evt) {
    // console.log('根据车牌号模糊查询客户车辆信息selected: ', JSON.stringify(evt));
    this.getLastOrderByCustomerVechileId(evt);
    // 车牌号输入框可用  其他客户车辆相关输入框不可用
    this.workSheetForm.controls.plateNo.enable();
  }
  /**
* @memberOf CreateOrderComponent
*/
  onCustomerNameSelect(evt) {
    // console.log('根据车主姓名模糊查询客户车辆信息selected: ', JSON.stringify(evt));
    this.getLastOrderByCustomerVechileId(evt);
    // 车主输入框可用  其他客户车辆相关输入框不可用
    this.workSheetForm.controls.customerName.enable();
  }

  // 客户车辆相关输入框可用
  enableCustomerVehicleField() {
    this.workSheetForm.controls.plateNo.enable();
    this.workSheetForm.controls.customerName.enable();
    this.workSheetForm.controls.phone.enable();
    this.workSheetForm.controls.vin.enable();
    this.workSheetForm.controls.brand.enable();
    this.workSheetForm.controls.series.enable();
    this.workSheetForm.controls.vehicleName.enable();
  }
  // 客户车辆相关输入框不可用
  disableCustomerVehicleField() {
    this.workSheetForm.controls.plateNo.disable();
    this.workSheetForm.controls.customerName.disable();
    this.workSheetForm.controls.phone.disable();
    this.workSheetForm.controls.vin.disable();
    this.workSheetForm.controls.brand.disable();
    this.workSheetForm.controls.series.disable();
    this.workSheetForm.controls.vehicleName.disable();
  }

  // 点击新增维修项目按钮 处理程序
  addNewmaintanceItem() {
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
  onConfirmAddNewMaintenanceItem() {
    if (this.isWorkHourValid() && this.isPriceValid() && this.isDiscountValid()) {
      if (!this.newMaintenanceItem.serviceId) {
        // 添加维修项目
        this.service.createMaintenanceItem({ name: this.newMaintenanceItem.serviceName })
          .then(data => {
            this.alerter.success('新建维修项目成功, 返回的数据为：', data);
            this.newMaintenanceItem.serviceId = data.id;

            this.newMaintenanceItemDataHandler();
          }).catch(err => {
            this.alerter.error('新建维修项目失败：' + err + '请重新输入维修项目名称');
          });
      } else {
        this.newMaintenanceItemDataHandler();
      }
    } else {
      // 数据输入不合法
      this.alerter.error('数据输入不合法');
    }
  }

  newMaintenanceItemDataHandler() {
    this.newMaintenanceItem.price = this.newMaintenanceItem.price * 100; // 转成分
    this.newMaintenanceItem.amount = this.newMaintenanceItem.amount.toFixed(2) * 100; // 转成分
    this.newMaintenanceItemData2.push(this.newMaintenanceItem);
    // 维修项目编辑区域不可见
    this.addNewMaintenanceItem = false;
    // 费用计算
    this.fee.workHour += parseFloat(this.newMaintenanceItem.amount);
    // 判断生成工单按钮是否可用
    this.enableCreateWorkSheet = this.workSheetForm.valid;
  }

  // 从表格中删除一条添加的维修项目事件处理程序
  onDelNewMaintenanceItem(evt, serviceId) {
    evt.preventDefault();

    this.newMaintenanceItemData2.filter((item, index) => {
      if (item.serviceId === serviceId) {
        this.newMaintenanceItemData2.splice(index, 1);
        // 费用计算
        this.fee.workHour -= parseFloat(item.amount);
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

  // 从下拉列表中选择一个维修项目事件处理程序
  serviceTypeaheadOnSelect(evt) {
    // console.log('当前选择的维修项目为：', evt);
    // 保存当前选择的维修项目名称
    this.newMaintenanceItem.serviceName = evt.name;
    // 保存当前选择的维修项目id
    this.newMaintenanceItem.serviceId = evt.id;
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

    // console.log('提交的挂掉对象为：', JSON.stringify(workSheet));

    this.suspendBill.suspend(workSheet)
      .then(() => this.suspendBill.refresh())
      .then(() => {
        this.alerter.success('挂单成功！');
        // 挂单按钮不可用  防止重复提交
        this.enableSuspendWorkSheet = true;
        // 清空数据
        this.initOrderData();
      })
      .catch(err => {
        // 挂单按钮不可用  防止重复提交
        this.enableSuspendWorkSheet = true;
        this.alerter.error(err);
      });
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
      this.newMaintenanceItem.amount = parseFloat(this.newMaintenanceItem.workHour) * parseFloat(this.newMaintenanceItem.price);
      if (this.isDiscountValid()) {
        const discountRatio = this.newMaintenanceItem.discount / 100;
        this.newMaintenanceItem.amount = this.newMaintenanceItem.amount * discountRatio;
      }
    }
  }


  /**
   * 从挂单列表中删除一条挂单记录
   * @param evt 
   */
  onSuspendedBillRemove(evt) {
    console.log('当前删除的挂单记录为：', evt);
    // 如果当前删除的挂单记录  正好是当前正在编辑的挂掉记录
    if (this.workSheetForm.value.suspendedBillId && this.workSheetForm.value.suspendedBillId === evt.id) {
      // 重置表单数据
      this.initOrderData();
    }
  }

  /**
   * 点击挂单列表的时候, 载入挂单信息
   * @memberOf CreateOrderComponent
   */
  onSuspendedBillSelect(evt) {
    console.log('当前选择的挂掉记录为：', evt, this.isSelected);
    const order = evt.value;
    // 保存挂单id
    order.suspendedBillId = evt.id;
    // 表单赋值
    this.workSheetForm.patchValue(order);

    // 如果当前选择的挂单记录是通过模糊查询带出来的   那么客户车辆信息不可修改
    if (order.customerVehicleId) {
      this.disableCustomerVehicleField();
    }

    // 计算费用
    this.fee.workHour = order.maintenanceItems.reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue.amount);
    }, 0);

    // 需要深copy order对象  不能改变原对象 
    // 因为每次选择一个挂掉的时候，挂单记录不会从列表中消失 只有点击创建工单之后  才消失
    const copiedOrder = Object.assign({}, order);
    copiedOrder.maintenanceItems = this.deepCopyArray(order.maintenanceItems);

    // 记录当前选择的挂单
    this.newMaintenanceItemData2 = copiedOrder.maintenanceItems;

    // // 判断生成工单按钮是否可用
    this.enableCreateWorkSheet = this.workSheetForm.valid && this.newMaintenanceItemData2.length > 0;
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
      // billCode: '', // 工单号
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
      vehicleName: [{ value: '', disabled: true }, [Validators.required]], // 车型
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
      nextMileage: '', // 建议下次保养里程

      suspendedBillId: '', // 挂单id
      customerVehicleId: '', // 客户车辆id
      customerId: '', // 客户id
      brandId: '', // 客户id
      seriesId: '', // 车系id
      vehicleId: '', // 车辆id
    });

    this.serviceForm = this.fb.group({
      serviceName: ['', [Validators.required]], // 维修项目名称
    });
    this.workHourForm = this.fb.group({
      workHour: ['', [Validators.required]], // 维修工时
    });
    this.workHourPriceForm = this.fb.group({
      workHourPrice: ['', [Validators.required]], // 工时单价
    });
    this.discountRatioForm = this.fb.group({
      discountRatio: ['', [Validators.required]], // 折扣率
    });

    // patchValue方法会触发FromGroup的valueChanges事件

    // 表单域中的值改变事件监听
    this.workSheetForm.valueChanges.subscribe(data => {
      // 只有表单域合法并且有新增维修项目数据的时候， 生成订单按钮才可用
      this.enableCreateWorkSheet = this.workSheetForm.valid && this.newMaintenanceItemData2.length > 0;
    });

    // 车牌号表单域值改变事件监听
    this.workSheetForm.controls.plateNo.valueChanges.subscribe((newValue) => {
      if (this.isSelected) {
        this.initOrderData();
        this.workSheetForm.controls.plateNo.setValue(newValue);
      }
    });
    // 车主表单域值改变事件监听
    this.workSheetForm.controls.customerName.valueChanges.subscribe((newValue) => {
      if (this.isSelected) {
        this.initOrderData();
        this.workSheetForm.controls.customerName.setValue(newValue);
      }
    });
    // 品牌表单域值改变事件监听
    this.workSheetForm.controls.brand.valueChanges.subscribe((newValue) => {
      if (!this.workSheetForm.controls.brand.disabled) {
        // 设置当前选择的品牌id为null
        this.workSheetForm.controls.brandId.reset();
        // 设置当前选择的车系id为null
        this.workSheetForm.controls.seriesId.reset();

        this.workSheetForm.controls.series.reset();
        this.workSheetForm.controls.vehicleName.reset();
        this.workSheetForm.controls.series.disable();
        this.workSheetForm.controls.vehicleName.disable();
      }
    });
    // 车系表单域值改变事件监听
    this.workSheetForm.controls.series.valueChanges.subscribe((newValue) => {
      if (!this.workSheetForm.controls.series.disabled) {
        // 设置当前选择的车系id为null
        this.workSheetForm.controls.seriesId.reset();

        this.workSheetForm.controls.vehicleName.reset();
        this.workSheetForm.controls.vehicleName.disable();
      }
    });
    // 车型表单域值改变事件监听
    this.workSheetForm.controls.vehicleName.valueChanges.subscribe((newValue) => {
      if (!this.workSheetForm.controls.vehicleName.disabled) {
        this.workSheetForm.controls.vehicleId.reset();
      }
    });
  }

  /**
   * 获取当前正在编辑的工单信息
   */
  private getEdittingOrder() {
    // 组织接口参数

    // 1.表单基础数据  getRawValue获取表单所有数据  包括disabled (value属性不能获取disabled表单域值)
    const workSheet = this.workSheetForm.getRawValue();
    // 2.新增维修项目数据 this.newMaintenanceItemData
    workSheet.maintenanceItems = this.newMaintenanceItemData2;

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
    }, { emitEvent: false }); // 不触发valueChanges事件

    // 清空客户车辆信息数据   上次选择的品牌id和车系id,车型id
    this.newMaintenanceItemData2 = [];

    // 重置费用
    this.fee.workHour = 0;
    this.fee.material = 0;
    this.fee.other = 0;

    // 清空上次维修工单数据
    this.lastOrderData = null;

    this.isSelected = false;
    this.enableCustomerVehicleField();
  }

  // 创建工单按钮点击事件处理程序
  createWorkSheet() {
    // 设置创建工单按钮不可用
    this.enableCreateWorkSheet = false;
    // 获取当前录入的工单信息
    const workSheet = this.getEdittingOrder();

    // 调用创建工单接口
    console.log('提交的工单对象： ', JSON.stringify(workSheet));

    this.service.create(workSheet)
      // 刷新挂单列表
      .then(() => this.suspendBill.refresh())
      .then(data => {
        // console.log('创建工单成功之后， 返回的工单对象：', data);
        this.alerter.success('创建工单成功！');
        // 创建订单成功之后  做一些重置操作

        // 清空数据
        this.initOrderData();
      }).catch(err => {
        // 出错的话  允许再次提交
        this.enableCreateWorkSheet = true;

        this.alerter.error('创建工单失败:' + err);
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
  public get nameTypeaheadColumns() {
    return [
      { name: 'name', title: '名称' },
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
  public get serviceNameTypeaheadSource() {
    return this.typeaheadSource(this.service.getMaintenanceItemsByName);
  }
  // 根据品牌名称模糊查询数据源
  public get brandTypeaheadSource() {
    return (params: TypeaheadRequestParams) => {
      const p = new VehicleBrandSearchRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.service.getVehicleByBrand(p);
    };
  }
  // 根据车系名称模糊查询数据源
  public get seriesTypeaheadSource() {
    return (params: TypeaheadRequestParams) => {
      const p = new VehicleSeriesSearchRequest(params.text, this.workSheetForm.controls.brandId.value);
      p.setPage(params.pageIndex, params.pageSize);
      return this.service.getVehicleBySeries(p);
    };
  }
  // 根据车型名称模糊查询数据源
  public get modelTypeaheadSource() {
    return (params: TypeaheadRequestParams) => {
      const p = new VehicleSearchRequest(params.text, this.workSheetForm.controls.brandId.value, this.workSheetForm.controls.seriesId.value);
      p.setPage(params.pageIndex, params.pageSize);
      return this.service.getVehicleByModel(p);
    };
  }
}
