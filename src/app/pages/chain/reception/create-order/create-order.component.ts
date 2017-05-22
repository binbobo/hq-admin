import { Component, Injector, OnInit, ViewChild} from '@angular/core';
import { OrderService, OrderListRequest, Order, Vehicle, MaintenanceItem, MaintenanceType, CustomerVehicle, FuzzySearchRequest, VehicleSeriesSearchRequest, VehicleBrandSearchRequest, VehicleSearchRequest } from '../order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabsetComponent, ModalDirective } from 'ngx-bootstrap';
import * as moment from 'moment';
import { TypeaheadRequestParams, PrintDirective} from 'app/shared/directives';
import { DataList, StorageKeys } from 'app/shared/models';
import { SuspendBillDirective } from 'app/pages/chain/chain-shared';
import { CustomValidators } from 'ng2-validation';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css'],
})
export class CreateOrderComponent extends DataList<Order> implements OnInit {
  // 标志是否是根据车牌号或者车主或者挂单列表中选择的历史数据
  // 车辆模糊查询  用于自动带出车型，车系，品牌信息
  isSelected = false;

  // 生产工单按钮是否可用
  public enableCreateWorkSheet = false;
  // 挂单按钮是否可用
  public enableSuspendWorkSheet = false;

  @ViewChild(SuspendBillDirective)
  private suspendBill: SuspendBillDirective;

  @ViewChild('printer')
  public printer: PrintDirective;

  // 上次维修工单信息
  public lastOrderData = null;

  // 当前选择的维修项目记录  用于编辑
  selectedItem: any;
  // 当前已经选择的维修项目列表
  selectedServices: Array<any> = [];

  // 维修类型数据
  public maintenanceTypeData: MaintenanceType[];
  // 创建工单表单FormGroup
  workSheetForm: FormGroup;

  // 保存所有添加的维修项目记录
  newMaintenanceItemData = [];

  // 新创建的维修工单数据  用于打印
  newWorkOrderData: any;

  // 加载动画是否显示标志
  generating = false;

  // 费用计算相关
  fee = {
    workHour: 0,
    material: 0,
    other: 0,
    discount: 0
  };

  regex = {
    plateNo: /^[\u4e00-\u9fa5]{1}[A-Za-z]{1}[A-Za-z_0-9]{5}$/,
    phone: /^1[3|4|5|7|8]\d{9}$/,
    mileage: /^[0-9]+([.]{1}[0-9]{1,2})?$/,
    vin: /^[A-HJ-NPR-Z\d]{8}[\dX][A-HJ-NPR-Z\d]{2}\d{6}$/
  };

  // 当前登录用户信息
  public user = null;

  isBrandSelected = false;
  isSeriesSelected = false;
  isVehicleSelected = false;

  isFuzzySearchEnable = true;


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

  brandChange() {
    this.workSheetForm.controls.series.reset();
    this.workSheetForm.controls.seriesId.reset();
    this.workSheetForm.controls.series.disable();

    this.workSheetForm.controls.vehicleName.reset();
    this.workSheetForm.controls.vehicleId.reset();
    this.workSheetForm.controls.vehicleName.disable();
  }

  seriesChange() {
    this.workSheetForm.controls.vehicleName.reset();
    this.workSheetForm.controls.vehicleId.reset();
    this.workSheetForm.controls.vehicleName.disable();
  }

  // 从模糊查询下拉列表中选择一个品牌事件处理程序
  onBrandSelect(evt) {
    this.isBrandSelected = true;
    if (this.workSheetForm.controls.series.enabled) {
      this.brandChange();
    }
    // 设置当前选择的品牌id
    this.workSheetForm.controls.brandId.setValue(evt.id);
    this.workSheetForm.controls.brand.setValue(evt.name);
    // enable车系选择
    this.workSheetForm.controls.series.enable();
  }
  // 从模糊查询下拉列表中选择一个车系事件处理程序
  onSeriesSelect(evt) {
    this.isSeriesSelected = true;
    if (this.workSheetForm.controls.vehicleName.enabled) {
      this.seriesChange();
    }
    // 设置当前选择的车系id
    this.workSheetForm.controls.seriesId.setValue(evt.id);
    this.workSheetForm.controls.series.setValue(evt.name);
    // enable车型选择
    this.workSheetForm.controls.vehicleName.enable();
  }

  onVehicleBlur() {
    console.log('vehicle on blur');
    if (!this.workSheetForm.controls.vehicleId.value) {
      this.workSheetForm.controls.vehicleName.setValue('');
    }
  }

  onPlateNoBlur(val) {
    if (!this.isSelected && this.workSheetForm.controls.plateNo.valid) {
      this.isFuzzySearchEnable = false;
    } else {
      this.isFuzzySearchEnable = true;
    }
  }
  onCustomerNameBlur(val) {
    if (!this.isSelected && this.workSheetForm.controls.customerName.valid) {
      this.workSheetForm.controls.contactUser.setValue(val);
    }
  }
  onPhoneBlur(val) {
    if (this.workSheetForm.controls.phone.valid) {
      this.workSheetForm.controls.contactInfo.setValue(val);
    }
  }

  // 从模糊查询下拉列表中选择一个车型事件处理程序
  onModelSelect(evt) {
    this.isVehicleSelected = true;
    // console.log('车型选择:', evt);

    this.workSheetForm.controls.vehicleId.setValue(evt.id);
    this.workSheetForm.controls.vehicleName.setValue(evt.name);

    this.enableCreateWorkSheet = (this.newMaintenanceItemData.length > 0) && this.workSheetForm.valid;
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
      console.log('加载上次工单信息失败！缺少客户车辆ID');
      return;
    }

    // 根据客户车辆id查询上次工单信息
    this.service.getLastOrderInfo(evt.id).then(lastOrder => {
      // console.log('根据客户车辆id自动带出的上次工单信息：', JSON.stringify(lastOrder));
      if (lastOrder) {
        // 加载上次维修记录
        this.loadLastOrderInfo(lastOrder);
        // 保存上次工单记录
        this.lastOrderData = lastOrder;
      }
      // 设置选择为true
      this.isSelected = true;
    }).catch(err => {
      // 没有上次工单记录  或者  接口出错
      this.isSelected = true;
    });
  }

  // 根据车牌号， 车主， vin 自动带出客户车辆信息
  loadLastOrderInfo(lastOrder) {
    // 加载上次工单信息
    this.workSheetForm.patchValue({
      // type: lastOrder.type,
      // mileage: lastOrder.mileage,
      // introducer: lastOrder.introducer,
      // introintroPhoneducer: lastOrder.introPhone,
      // validate: moment(lastOrder.validate).format('YYYY-MM-DD'),
      // location: lastOrder.location,
      contactUser: lastOrder.contactUser,
      contactInfo: lastOrder.contactInfo,
      lastEnter: moment(lastOrder.lastEnter).format('YYYY-MM-DD HH:mm'),
      lastMileage: lastOrder.lastMileage,
    });
  }

  // 根据车牌号， 车主， vin 自动带出客户车辆信息
  loadCustomerVehicleInfo(customerVehicle) {
    console.log('当前选择的客户车辆信息', customerVehicle);
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
    // 设置品牌 车系 车型选中状态为true
    this.isBrandSelected = this.isSeriesSelected = this.isVehicleSelected = true;
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

  close(addModal) {
    // 如果是从编辑界面上取消或者关闭弹框 回写
    if (this.selectedItem) {
      this.selectedServices.push({
        id: this.selectedItem.serviceId,
        name: this.selectedItem.serviceName,
      });
      this.selectedItem = null;
    }
    addModal.hide();
  }

  // 编辑维修项目
  onMaintenanceItemEdit(addModal, item) {
    this.selectedItem = {};
    Object.assign(this.selectedItem, item);
    this.selectedItem.price = this.selectedItem.price / 100;
    this.selectedItem.amount = this.selectedItem.amount / 100;
    // 当前编辑的维修项目仍然可选
    const index = this.selectedServices.findIndex(elem => elem.id === item.serviceId);
    if (index > -1) {
      this.selectedServices.splice(index, 1);
    }

    // 显示窗口
    addModal.show();
  }

  onConfirmNewMaintenanceItem(evt, addModal) {
    console.log('新增的维修项目数据为：', evt);

    // 获取维修项目数据
    const data = evt.data;
    data.workHour = data.workHour * 1;
    data.price = data.price * 100;
    data.amount = data.amount * 100;
    if (evt.isEdit && this.selectedItem) {
      // 编辑
      const index = this.newMaintenanceItemData.findIndex((item) => {
        return item.serviceId === this.selectedItem.serviceId;
      });
      // 使用新的元素替换以前的元素
      this.newMaintenanceItemData.splice(index, 1, data);
      // 更新价格
      const workHourFeediff: number = data.price * data.workHour - (this.selectedItem.price * 100) * this.selectedItem.workHour;
      this.fee.workHour += workHourFeediff * 1;
      // 看看折扣了多少钱
      const discountFeediff: number = (data.price * data.workHour - data.amount) - ((this.selectedItem.price * 100) * this.selectedItem.workHour - this.selectedItem.amount * 100);
      this.fee.discount += discountFeediff * 1;

      // 清空当前编辑的维修项目记录
      this.selectedItem = null;
    } else {
      // 新增
      this.newMaintenanceItemData.push(data);
      // 费用计算
      this.fee.workHour += data.price * data.workHour;
      //
      this.fee.discount += data.price * data.workHour - data.amount;
    }
    // 记录当前选择的维修项目
    this.selectedServices = this.getSelectedServices();
    // 判断生成工单按钮是否可用
    this.enableCreateWorkSheet = this.workSheetForm.valid;
    addModal.hide();
  }

  // 从表格中删除一条添加的维修项目事件处理程序
  onDelMaintenanceItem(serviceId) {
    this.newMaintenanceItemData.filter((item, index) => {
      if (item.serviceId === serviceId) {
        this.newMaintenanceItemData.splice(index, 1);
        // 费用计算
        this.fee.workHour -= item.price * item.workHour;
        this.fee.discount -= item.price * item.workHour - item.amount;
        // 如果新增项目为0 设置生成工单按钮不可用
        this.enableCreateWorkSheet = (this.newMaintenanceItemData.length > 0) && this.workSheetForm.valid;
        return;
      }
    });
    this.selectedServices = this.getSelectedServices();
  }

  private getSelectedServices() {
    return this.newMaintenanceItemData.map(item => {
      return {
        id: item.serviceId,
        name: item.serviceName
      };
    });
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
        this.enableSuspendWorkSheet = false;
        // 清空数据
        this.initOrderData();
      })
      .catch(err => {
        // 挂单按钮可用
        this.enableSuspendWorkSheet = true;
        this.alerter.error('挂单失败：' + err, true, 3000);
      });
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
    console.log('当前选择的挂掉记录为：', evt);
    const order = evt.value;
    // 保存挂单id
    order.suspendedBillId = evt.id;

    // 如果当前选择的挂单记录是通过模糊查询带出来的
    if (order.customerVehicleId) {
      // 客户车辆信息不可修改
      this.disableCustomerVehicleField();
      // 设置车辆选择为true
      this.isBrandSelected = this.isSeriesSelected = this.isVehicleSelected = true;
    }

    // 表单赋值
    this.workSheetForm.patchValue(order);

    // 计算费用
    this.fee.workHour = order.maintenanceItems.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.price * currentValue.workHour;
    }, 0);
    this.fee.discount = this.fee.workHour - order.maintenanceItems.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount * 1;
    }, 0);

    // 需要深copy 维修项目记录  不能改变原对象 
    // 因为每次选择一个挂掉的时候，挂单记录不会从列表中消失 只有点击创建工单之后  才消失
    this.newMaintenanceItemData = this.deepCopyArray(order.maintenanceItems);

    // 判断生成工单按钮是否可用
    this.enableCreateWorkSheet = this.workSheetForm.valid && this.newMaintenanceItemData.length > 0;
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
      customerName: ['', [Validators.required]], // 车主
      phone: ['', Validators.compose([Validators.pattern(this.regex.phone)])], // 车主电话
      createdOnUtc: [{ value: moment().format('YYYY-MM-DD HH:mm'), disabled: true }], // 进店时间 / 开单时间
      contactUser: ['', [Validators.required]], // 送修人
      contactInfo: ['', Validators.compose([Validators.required, Validators.pattern(this.regex.phone)])], // 送修人电话
      createdUserName: [{ value: this.user.username, disabled: true }], // 服务顾问
      introducer: '', // 介绍人
      introPhone: '', // 介绍人电话
      brand: ['', [Validators.required]], // 品牌
      series: [{ value: '', disabled: true }, [Validators.required]], // 车系
      vehicleName: [{ value: '', disabled: true }, [Validators.required]], // 车型
      plateNo: ['', Validators.compose([Validators.required, Validators.pattern(this.regex.plateNo)])], // 车牌号
      vin: ['', Validators.compose([Validators.required, Validators.pattern(this.regex.vin)])], // vin  底盘号
      validate: [null, [CustomValidators.date]], // 验车日期
      type: ['', [Validators.required]], // 维修类型
      expectLeave: [moment().add(2, 'hours').format('YYYY-MM-DD HH:mm'), [Validators.required, CustomValidators.date]], // 预计交车时间
      mileage: ['', Validators.compose([Validators.required, Validators.pattern(this.regex.mileage)])], // 行驶里程
      lastEnter: [{ value: null, disabled: true }], // 上次进店时间
      location: '', // 维修工位
      nextDate: [null, [CustomValidators.date]], // 建议下次保养日期
      lastMileage: [{ value: '', disabled: true }], // 上次进店里程
      nextMileage: ['', Validators.compose([Validators.pattern(this.regex.mileage)])], // 建议下次保养里程

      suspendedBillId: '', // 挂单id
      customerVehicleId: '', // 客户车辆id
      customerId: '', // 客户id
      brandId: '', // 客户id
      seriesId: '', // 车系id
      vehicleId: '', // 车辆id
    });
    // patchValue方法会触发FromGroup的valueChanges事件

    // 表单域中的值改变事件监听
    this.workSheetForm.valueChanges.subscribe(data => {
      // 只有表单域合法并且有新增维修项目数据的时候， 生成订单按钮才可用
      this.enableCreateWorkSheet = this.workSheetForm.controls.vehicleId.value && this.workSheetForm.valid && this.newMaintenanceItemData.length > 0;
    });

    // 车牌号表单域值改变事件监听
    this.workSheetForm.controls.plateNo.valueChanges.subscribe((newValue) => {
      this.enableSuspendWorkSheet = this.workSheetForm.controls.plateNo.valid;

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
      if (this.isBrandSelected) {
        this.isBrandSelected = false;
        return;
      }
      // 设置当前选择的品牌id为null
      this.workSheetForm.controls.brandId.reset();
      this.brandChange();
    });
    // 车系表单域值改变事件监听
    this.workSheetForm.controls.series.valueChanges.subscribe((newValue) => {
      if (this.isSeriesSelected) {
        this.isSeriesSelected = false;
        return;
      }
      // 设置当前选择的车系id为null
      this.workSheetForm.controls.seriesId.reset();
      this.seriesChange();
    });
    // 车型表单域值改变事件监听
    this.workSheetForm.controls.vehicleName.valueChanges.subscribe((newValue) => {
      if (this.isVehicleSelected) {
        this.isVehicleSelected = false;
        return;
      }
      this.workSheetForm.controls.vehicleId.reset();
    });
  }

  /**
   * 获取当前正在编辑的工单信息
   */
  private getEdittingOrder() {
    // 组织接口参数

    // 1.表单基础数据  getRawValue获取表单所有数据  包括disabled (value属性不能获取disabled表单域值)
    const workSheet = this.workSheetForm.getRawValue();
    // 时间类型的输入框  如果没有值的话 不传到后台
    if (!workSheet.validate) { delete workSheet.validate; }
    if (!workSheet.lastEnter) { delete workSheet.lastEnter; }
    if (!workSheet.nextDate) { delete workSheet.nextDate; }
    // 车牌号转成大写
    workSheet.plateNo = workSheet.plateNo.toUpperCase();
    // 2.新增维修项目数据
    workSheet.maintenanceItems = this.newMaintenanceItemData;
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
      createdOnUtc: { value: moment().format('YYYY-MM-DD HH:mm'), disabled: true },
      createdUserName: this.user.username,
      expectLeave: moment().add(2, 'hours').format('YYYY-MM-DD HH:mm')
    }, { emitEvent: false }); // 不触发valueChanges事件

    // 清空客户车辆信息数据   上次选择的品牌id和车系id,车型id
    this.newMaintenanceItemData = [];

    // 重置费用
    this.fee.workHour = 0;
    this.fee.material = 0;
    this.fee.other = 0;

    // 清空上次维修工单数据
    this.lastOrderData = null;

    this.isSelected = false;
    this.isFuzzySearchEnable = true;
    this.enableCustomerVehicleField();
    // 重置新添加的工单记录
    this.newWorkOrderData = null;

    this.isBrandSelected = this.isSeriesSelected = this.isVehicleSelected = false;
  }

  print() {
    this.printer.print();
  }


  // 创建工单按钮点击事件处理程序
  createWorkSheet() {
    this.generating = true;

    // 设置创建工单按钮不可用
    this.enableCreateWorkSheet = false;
    // 获取当前录入的工单信息
    const workSheet = this.getEdittingOrder();
    if (!workSheet.vehicleId) {
      this.workSheetForm.controls.vehicleName.setValue('');
      return;
    }

    // 调用创建工单接口
    console.log('提交的工单对象： ', JSON.stringify(workSheet));

    // this.service.create(workSheet)
    //   .then(data => {
    //     this.generating = false;
    //     console.log('创建工单成功之后， 返回的工单对象：', JSON.stringify(data));
    //     // 创建订单成功之后  做一些重置操作
    //     if (confirm('创建工单成功！ 是否打印？')) {
    //       this.newWorkOrderData = data;
    //       // 延迟打印
    //       setTimeout(() => {
    //         this.print();
    //         // 延迟清空数据
    //         setTimeout(() => {
    //           this.initOrderData();
    //           // 刷新挂单列表
    //           if (workSheet.suspendedBillId) {
    //             this.suspendBill.refresh();
    //           }
    //         }, 100);
    //       }, 100);
    //     } else {
    //       // 清空数据
    //       this.initOrderData();
    //       // 刷新挂单列表
    //       if (workSheet.suspendedBillId) {
    //         this.suspendBill.refresh();
    //       }
    //     }
    //   }).catch(err => {
    //     this.generating = false;
    //     // 出错的话  允许再次提交
    //     this.enableCreateWorkSheet = true;

    //     this.alerter.error('创建工单失败:' + err, true, 3000);
    //   });
  }

  public get currentDate() {
    return moment().format('YYYY-MM-DD');
  }

  public get currentHours() {
    return moment().hours();
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
