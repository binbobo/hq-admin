import { Component, Injector } from '@angular/core';
import { DataList } from '../../../shared/models/data-list';
import { OrderService, OrderListRequest, Order, Vehicle, MaintenanceItem, MaintenanceType, CustomerVehicle } from '../order.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';
import { ViewCell } from 'ng2-smart-table';
import { CustomDatetimeEditorComponent } from './custom-datetime-editor.component';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';



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

  // 客户车辆模糊查询  用于带出在本店维修过项目的客户车辆信息

  // 结果集
  public customerVehicles: CustomerVehicle[];
  // 当前选择的客户车辆对象
  public selectedCustomerVehicle: CustomerVehicle = new CustomerVehicle();
  // 通过车牌号查询异步数据源
  public plateNoDataSource: Observable<CustomerVehicle>;
  //
  plateNoSelected: string;
  // 通过车主姓名查询异步数据源
  public customerNameDataSource: Observable<CustomerVehicle>;
  customerNameSelected: string;


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
  // 保存模糊查询的维修项目数据
  maintenanceItemData: MaintenanceItem[];
  // 从模糊查询列表中选择的维修项目
  selectedMaintanceItem: MaintenanceItem;

  // ng2-smart-table相关配置

  // smart table 公共配置
  private stAttr = {
    class: 'table-hover'  // 作用于智能表单的类
  };
  private stFilter = {
    inputClass: 'inputFilter'
  };
  private stActions = {
    columnTitle: '操作',
    edit: false,   // 不显示编辑按钮
  };
  private stAdd = {
    addButtonContent: '新增',
    createButtonContent: '添加',
    cancelButtonContent: '取消',
    confirmCreate: true    // 添加确认事件必须配置项
  };
  private stDelete = {
    deleteButtonContent: '删除',
    confirmDelete: true
  };


  // 维修项目表头
  maintanceItemSettings = {
    attr: this.stAttr,
    filter: this.stFilter,
    actions: this.stActions,
    add: this.stAdd,
    delete: this.stDelete,
    columns: {
      serviceName: {
        title: '维修项目名称',
        type: 'html',
        editor: {
          type: 'custom',
          component: CustomDatetimeEditorComponent
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

    // 根据名称获取维修项目信息
    this.service.getMaintenanceItemsByName('维修')
      .subscribe(data => {
        this.maintenanceItemData = data;
      });

    // 构建表单
    this.createForm();

    // 获取挂起的订单
    this.unsettledOrders = this.getUnsettledOrders();

    // 根据名称获取维修项目信息
    this.plateNoDataSource = Observable
      .create((observer: any) => {
        observer.next(this.plateNoSelected);
      })
      .debounceTime(300)
      .distinctUntilChanged()
      .mergeMap((token: string) => this.service.getCustomerVehicleByPlateNo(token))
      .catch(err => console.log(err)) ;

    // 根据名称获取维修项目信息
    this.customerNameDataSource = Observable
      .create((observer: any) => {
        observer.next(this.customerNameSelected);
      })
      .debounceTime(300)
      .distinctUntilChanged()
      .mergeMap((token: string) => this.service.getCustomerVehicleByCustomerName(token))
      .catch(err => console.log(err)) ;
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
        serviceName: newData.serviceName,
        workHour: newData.serviceName,
        price: newData.money,
        discount: newData.money,
      });
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
  loadOrderInfo(order, pop) {
    // 隐藏popover
    pop.hide();
    console.log(order);
  }

  createForm() {
    this.createWorkSheetForm = this.fb.group({
      billCode: '', // 工单号
      customerName: [this.selectedCustomerVehicle.customerName, [Validators.required]], // 车主
      phone: [this.selectedCustomerVehicle.phone, [Validators.required]], // 车主电话
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
      vin: [this.selectedCustomerVehicle.vin, [Validators.required]],
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
    console.log(this.createWorkSheetForm.valid);
    console.log(this.createWorkSheetForm.value);
    if (!this.createWorkSheetForm.valid) {
      return;
    }
    // 组织接口参数
    // 1.表单基础数据 this.createWorkSheetForm.value
    // 2.新增维修项目数据 this.newMaintenanceItemData
    // 3. 当前登陆用户信息数据(操作员，组织id, ...)
    // 调用创建工单接口
    this.service.create(this.createWorkSheetForm.value);
  }
}
