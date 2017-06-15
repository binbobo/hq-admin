import { Component, Injector, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { OrderService, OrderListRequest, Order, Vehicle, MaintenanceItem, MaintenanceType } from '../order.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TabsetComponent, ModalDirective } from 'ngx-bootstrap';
import * as moment from 'moment';
import { PrintDirective } from 'app/shared/directives';
import { DataList, StorageKeys } from 'app/shared/models';
import { SuspendBillDirective } from 'app/pages/chain/chain-shared';
import { CustomValidators } from 'ng2-validation';
import { HQ_VALIDATORS } from '../../../../shared/shared.module';


@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class CreateOrderComponent extends DataList<Order> implements OnInit {
  // 标志是否是根据车牌号或者车主或者挂单列表中选择的历史维修数据或者预检单
  isSelected = false;
  // 生产工单按钮是否可用
  public enableCreateWorkSheet = false;

  @ViewChild(SuspendBillDirective)
  private suspendBill: SuspendBillDirective;
  @ViewChild('printer')
  public printer: PrintDirective;

  // 上次维修工单信息
  public lastOrderData = null;
  // 预检单信息
  public preCheckOrderData = null;

  // 当前选择的维修项目记录  用于编辑
  selectedItem: any;
  // 当前已经选择的维修项目列表 用于过滤
  selectedServices: Array<any> = [];

  // 维修类型数据
  maintenanceTypeData: MaintenanceType[];
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
    workHours: 0, // 工时合计
    workHour: 0, // 工时费
    discount: 0, // 优惠
    amount: 0 // 应收金额
  };

  // 品牌车系车型是否选择标志
  isBrandSelected = false;
  isSeriesSelected = false;
  isVehicleSelected = false;
  // 车牌号 车主姓名模糊查询框是否可用标志
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
    if (!this.workSheetForm.controls.vehicleId.value) {
      this.workSheetForm.controls.vehicleName.setValue('');
    }
  }
  onPlateNoBlur() {
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
  // 重新设置下次里程验证器 实现多个表单域联动验证
  private resetNextMileageValidators(val) {
    if (val)
      this.workSheetForm.controls.nextMileage.setValidators([HQ_VALIDATORS.mileage, CustomValidators.gte(val)]);
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
    // 初始化数据
    this.initOrderData();

    // 记录客户车辆id
    evt.customerVehicleId = evt.id;
    // 根据选择的车牌号带出客户车辆信息
    this.loadCustomerVehicleInfo(evt);

    // 客户车辆相关信息不可编辑
    this.disableCustomerVehicleField();

    if (!evt.id) {
      return;
    }

    // 根据客户车辆id查询上次工单信息
    this.service.getLastOrderInfo(evt.id).then(lastOrder => {
      // 保存上次工单记录
      this.lastOrderData = lastOrder;
      // 无论接口调用成功还是失败，都调用getPreCheckOrder()方法
      this.getPreCheckOrder(evt);
    }).catch(err => {
      // 没有上次工单记录  或者  接口出错 继续去尝试加载预检单记录
      this.getPreCheckOrder(evt);
    });
  }

  // 根据客户车辆id查询预检单信息
  private getPreCheckOrder(evt) {
    this.service.getPreCheckOrderInfoByCustomerVehicleId(evt.id).then(preCheckOrder => {
      this.preCheckOrderData = preCheckOrder;
      this.loadPreCheckOrderInfo(preCheckOrder);

      // 设置选择为true
      this.isSelected = true;
    }).catch(err => {
      console.log(err);
      // 没有预检单记录  或者  接口出错
      this.isSelected = true;
      // 设置送修人默认为车主
      this.workSheetForm.controls.contactUser.setValue(evt.name);
      this.workSheetForm.controls.contactInfo.setValue(evt.phone);
      // 加载上次维修记录数据
      this.loadLastOrderInfo(this.lastOrderData);
    });
  }

  // 根据车牌号， 车主自动带出上次维修历史记录信息
  loadLastOrderInfo(lastOrder) {
    if (!lastOrder) return;

    // 上次维修记录 带出部分信息
    this.workSheetForm.patchValue({
      contactUser: lastOrder.contactUser || lastOrder.customerName, // 没有默认带车主
      contactInfo: lastOrder.contactInfo || lastOrder.phone, // 没有默认带车主电话
      lastEnter: moment(lastOrder.lastEnter).format('YYYY-MM-DD HH:mm'),
      lastMileage: lastOrder.lastMileage,
    });
  }
  // 根据车牌号， 车主自动带出预检单记录信息
  loadPreCheckOrderInfo(preCheckOrder) {
    if (!preCheckOrder) return;
    // 预检单 带出所有能带出的信息
    this.workSheetForm.patchValue({
      preCheckId: preCheckOrder.id,
      contactUser: preCheckOrder.contactUser || preCheckOrder.customer.name,
      contactInfo: preCheckOrder.contactInfo || preCheckOrder.customer.phone,
      type: preCheckOrder.type,
      mileage: preCheckOrder.mileage,
      introducer: preCheckOrder.introducer,
      introPhone: preCheckOrder.introPhone,
      validate: preCheckOrder.validate ? moment(preCheckOrder.validate).format('YYYY-MM-DD') : '',
      location: preCheckOrder.location,
      nextDate: preCheckOrder.nextDate ? moment(preCheckOrder.nextDate).format('YYYY-MM-DD') : '',
      nextMileage: preCheckOrder.nextMileage,
    });
    this.resetNextMileageValidators(preCheckOrder.mileage);
  }

  // 根据车牌号， 车主 自动带出客户车辆信息
  loadCustomerVehicleInfo(customerVehicle) {
    // console.log('当前选择的客户车辆信息', JSON.stringify(customerVehicle));
    // 加载客户车辆信息
    this.workSheetForm.patchValue({
      plateNo: customerVehicle.plateNo,
      customerName: customerVehicle.name,
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
    // this.workSheetForm.controls.vin.enable();
    this.workSheetForm.controls.brand.enable();
    this.workSheetForm.controls.series.enable();
    this.workSheetForm.controls.vehicleName.enable();
  }
  // 客户车辆相关输入框不可用
  disableCustomerVehicleField() {
    this.workSheetForm.controls.plateNo.disable();
    this.workSheetForm.controls.customerName.disable();
    this.workSheetForm.controls.phone.disable();
    // this.workSheetForm.controls.vin.disable();
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
    // console.log('新增的维修项目数据为：', evt);

    // 获取维修项目数据
    const data = evt.data;
    data.workHour = data.workHour * 1;
    data.price = +(data.price * 100).toFixed(0);
    data.amount = +(data.price * 100).toFixed(0);
    if (evt.isEdit && this.selectedItem) {
      // 编辑
      const index = this.newMaintenanceItemData.findIndex((item) => {
        return item.serviceId === this.selectedItem.serviceId;
      });
      // 使用新的元素替换以前的元素
      this.newMaintenanceItemData.splice(index, 1, data);
      // 更新价格
      const workHourFeediff = data.price * data.workHour - (this.selectedItem.price * 100) * this.selectedItem.workHour;
      this.fee.workHour += workHourFeediff * 1;
      const discountFeediff = (data.price * data.workHour - data.amount) - ((this.selectedItem.price * 100) * this.selectedItem.workHour - this.selectedItem.amount * 100);
      this.fee.discount += discountFeediff * 1;
      this.fee.amount = this.fee.workHour - this.fee.discount;
      // 清空当前编辑的维修项目记录
      this.selectedItem = null;
    } else {
      // 新增
      this.newMaintenanceItemData.push(data);
      // 费用计算
      this.fee.workHour += data.price * data.workHour;
      this.fee.discount += data.price * data.workHour - data.amount;
      this.fee.amount = this.fee.workHour - this.fee.discount;
    }
    // 记录当前选择的维修项目
    this.selectedServices = this.getSelectedServices();
    // 判断生成工单按钮是否可用
    this.enableCreateWorkSheet = this.workSheetForm.controls.vehicleId.value && this.workSheetForm.valid;
    addModal.hide();
  }

  // 从表格中删除一条添加的维修项目事件处理程序
  onDelMaintenanceItem(serviceId) {
    if (!confirm('确定要删除当前选择的维修项目吗?')) { return; }
    this.newMaintenanceItemData.filter((item, index) => {
      if (item.serviceId === serviceId) {
        this.newMaintenanceItemData.splice(index, 1);
        // 费用计算
        this.fee.workHour -= item.price * item.workHour;
        this.fee.discount -= item.price * item.workHour - item.amount;
        this.fee.amount = this.fee.workHour - this.fee.discount;
        // 如果新增项目为0 设置生成工单按钮不可用
        this.enableCreateWorkSheet = (this.newMaintenanceItemData.length > 0) && this.workSheetForm.controls.vehicleId.value && this.workSheetForm.valid;
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
    // 判断车牌号是否合法
    if (!this.workSheetForm.controls.plateNo.valid) {
      this.alerter.error('请先输入正确的车牌号, 再执行挂单操作！', true, 3000);
      return;
    }
    // 获取当前录入的工单数据
    const workSheet = this.getEdittingOrder();
    // console.log('提交的挂掉对象为：', JSON.stringify(workSheet));
    this.suspendBill.suspend(workSheet)
      .then(() => this.suspendBill.refresh())
      .then(() => {
        this.alerter.success('挂单成功！');
        // 清空数据
        this.initOrderData();
      })
      .catch(err => {
        this.alerter.error('挂单失败：' + err, true, 3000);
      });
  }
  /**
   * 从挂单列表中删除一条挂单记录
   * @param evt 
   */
  onSuspendedBillRemove(evt) {
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
    // 清空数据
    this.initOrderData();

    // console.log('当前选择的挂掉记录为：', evt);
    const order = evt.value;
    // 保存挂单id
    order.suspendedBillId = evt.id;

    // 如果当前选择的挂单记录是通过模糊查询带出来的
    if (order.customerVehicleId) {
      // 客户车辆信息不可修改
      this.disableCustomerVehicleField();
      // 设置车辆选择为true
      this.isBrandSelected = this.isSeriesSelected = this.isVehicleSelected = true;
    } else {
      // 车主模糊查询不可用
      this.isFuzzySearchEnable = false;
    }

    // 表单赋值
    this.workSheetForm.patchValue(order);
    this.resetNextMileageValidators(order.mileage);

    // 计算费用
    this.fee.workHour = order.maintenanceItems.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.price * currentValue.workHour;
    }, 0);
    this.fee.discount = this.fee.workHour - order.maintenanceItems.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount * 1;
    }, 0);
    this.fee.amount += this.fee.workHour - this.fee.discount;

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
      phone: ['', [Validators.required, HQ_VALIDATORS.mobile]], // 车主电话
      contactUser: ['', [Validators.required]], // 送修人
      contactInfo: ['', [Validators.required, HQ_VALIDATORS.mobile]], // 送修人电话
      introducer: '', // 介绍人
      introPhone: '', // 介绍人电话
      brand: ['', [Validators.required]], // 品牌
      series: [{ value: '', disabled: true }, [Validators.required]], // 车系
      vehicleName: [{ value: '', disabled: true }, [Validators.required]], // 车型
      plateNo: ['', [Validators.required, HQ_VALIDATORS.plateNo]], // 车牌号
      vin: ['', [HQ_VALIDATORS.vin]], // vin  底盘号
      validate: [null, [CustomValidators.date]], // 验车日期f
      type: ['', [Validators.required]], // 维修类型
      expectLeave: [moment().add(2, 'hours').format('YYYY-MM-DD HH:mm'), [Validators.required, CustomValidators.date]], // 预计交车时间
      mileage: ['', [Validators.required, HQ_VALIDATORS.mileage]], // 行驶里程
      lastEnter: [{ value: null, disabled: true }], // 上次进厂时间
      location: '', // 维修工位
      nextDate: [null, [CustomValidators.date]], // 建议下次保养日期
      lastMileage: [{ value: '', disabled: true }], // 上次进店里程
      nextMileage: ['', [HQ_VALIDATORS.mileage]], // 建议下次保养里程

      // 隐藏域
      suspendedBillId: null, // 挂单id
      customerVehicleId: null, // 客户车辆id
      customerId: null, // 客户id
      brandId: null, // 客户id
      seriesId: null, // 车系id
      vehicleId: null, // 车辆id
      preCheckId: null, // 预检单id
    });
    // patchValue方法会触发FromGroup的valueChanges事件

    // 表单域中的值改变事件监听
    this.workSheetForm.valueChanges.subscribe(data => {
      // 只有表单域合法并且有新增维修项目数据的时候， 生成订单按钮才可用
      this.enableCreateWorkSheet = this.workSheetForm.controls.vehicleId.value && this.workSheetForm.valid && this.newMaintenanceItemData.length > 0;
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
    // vin转成大写
    if (workSheet.vin)
      workSheet.vin = workSheet.vin.toUpperCase();
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
      // 默认为当前时间后延2小时
      expectLeave: moment().add(2, 'hours').format('YYYY-MM-DD HH:mm'),
    }, { emitEvent: false });

    // 清空维修项目数据
    this.newMaintenanceItemData = [];

    // 重置费用
    this.fee.workHour = this.fee.discount = this.fee.workHours = this.fee.amount = 0;

    // 清空上次维修工单数据
    this.lastOrderData = null;
     // 清空预检单数据
    this.preCheckOrderData = null;

    this.isSelected = false;
    this.isFuzzySearchEnable = true;
    this.enableCustomerVehicleField();
    // 重置新添加的工单记录
    this.newWorkOrderData = null;
    // 品牌车系车型是否选择
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
    // console.log('提交的工单对象： ', JSON.stringify(workSheet));

    this.service.create(workSheet)
      .then(data => {
        this.generating = false;
        // 创建订单成功之后  做一些重置操作
        if (confirm('创建工单成功！ 是否打印？')) {
          // 组织打印需要的数据
          this.newWorkOrderData = {};
          Object.assign(this.newWorkOrderData, data);
          Object.assign(this.newWorkOrderData, workSheet);
          this.fee.workHours = this.newMaintenanceItemData.reduce((accumulator, currentValue) => {
            return currentValue.workHour;
          }, 0);
          this.newWorkOrderData.serviceOutputs = workSheet.maintenanceItems;
          this.newWorkOrderData.serviceOutputs.fee = this.fee;
          this.newWorkOrderData.typeName = this.maintenanceTypeData.find(item => item.id === workSheet.type).value;
          this.newWorkOrderData.printDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
          // 如果是预检单 添加预检单信息
          if(workSheet.preCheckId) {
            this.newWorkOrderData.preCheckOrder = this.preCheckOrderData;
            this.newWorkOrderData.preCheckOrder.emptyText = '暂无';
          }
          // 延迟打印
          setTimeout(() => {
            this.print();
            // 延迟清空数据
            setTimeout(() => {
              this.initOrderData();
              // 刷新挂单列表
              if (workSheet.suspendedBillId) {
                this.suspendBill.refresh();
              }
            }, 100);
          }, 100);
        } else {
          // 清空数据
          this.initOrderData();
          // 刷新挂单列表
          if (workSheet.suspendedBillId) {
            this.suspendBill.refresh();
          }
        }
      }).catch(err => {
        this.generating = false;
        // 出错的话  允许再次提交
        this.enableCreateWorkSheet = true;

        this.alerter.error(err, true, 3000);
      });
  }

  public get currentDate() {
    return moment().toDate();
  }
  public get currentHours() {
    return moment().hours();
  }

  // 定义要显示的列 用于挂单
  public get typeaheadColumns() {
    return [
      { name: 'plateNo', title: '车牌号' },
      { name: 'customerName', title: '车主' },
      { name: 'phone', title: '车主电话' },
    ];
  }
}
