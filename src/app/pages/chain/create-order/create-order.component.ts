import { Component, Injector } from '@angular/core';
import { DataList } from '../../../shared/models/data-list';
import { OrderService, OrderListRequest, Order, Vehicle } from '../order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';
import { ViewCell } from 'ng2-smart-table';
import { CustomDatetimeEditorComponent } from './custom-datetime-editor.component';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// Observable class extensions
import 'rxjs/add/observable/of';
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';


@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css'],
})
export class CreateOrderComponent extends DataList<Order> {
  private searchTerms = new Subject<string>();
  vehicles: Observable<Vehicle[]>;

  // 创建工单表单
  createWorkSheetForm: FormGroup;
  // ng2-smart-table

  // 维修项目数据
  maintenanceProjectData = [{
    name: 'Leanne Graham',
    manHours: '5',
    usemanHourPrice: '100',
    money: '500',
    discountRatio: '0',
    operationTime: '2017-04-18 15:30'
  }, {
    name: 'Graham Leanne',
    manHours: '5',
    usemanHourPrice: '100',
    money: '500',
    discountRatio: '0',
    operationTime: '2017-04-18 15:30'
  }];

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
    deleteButtonContent: '删除'
  };


  // 维修项目表头
  maintanceItemSettings = {
    attr: this.stAttr,
    filter: this.stFilter,
    actions: this.stActions,
    add: this.stAdd,
    delete: this.stDelete,
    columns: {
      name: {
        title: '维修项目名称',
        editor: {
          type: 'completer',
          config: {
            completer: {
              data: this.maintenanceProjectData, // 从维修项目大查询库中选择
              searchFields: 'name',
              titleField: 'name',
              descriptionField: '', // 在候选列表项后面显示
              placeholder: '请输入...'
            },
          },
        },
      },
      manHours: {
        title: '维修工时(小时)',
      },
      manHourPrice: {
        title: '工时单价(元)'
      },
      money: {
        title: '金额(元)'
      },
      discountRatio: {
        title: '折扣率'
      },
      operationTime: {
        title: '操作时间',
        type: 'html',
        editor: {
          type: 'custom',
          component: CustomDatetimeEditorComponent,
        },
      }
    }
  };

  // 维修配件表头
  maintanceFixingsSettings = {
    attr: this.stAttr,
    filter: this.stFilter,
    actions: this.stActions,
    add: this.stAdd,
    delete: this.stDelete,
    columns: {
      item: {
        title: '维修项目',
        editor: {
          type: 'completer',
          config: {
            completer: {
              data: [], // 新增的维修项目中选择
              searchFields: 'name',
              titleField: 'name',
              descriptionField: '', // 在候选列表项后面显示
              placeholder: '请输入...'
            },
          },
        },
      },
      name: {
        title: '配件名称'
      },
      brand: {
        title: '品牌'
      },
      type: {
        title: '规格型号'
      },
      amount: {
        title: '数量'
      },
      price: {
        title: '单价(元)'
      },
      money: {
        title: '金额(元)'
      },
      operationTime: {
        title: '操作时间'
      }
    }
  };
  // 附加项目表头
  addsOnItemSettings = {
    attr: this.stAttr,
    filter: this.stFilter,
    actions: this.stActions,
    add: this.stAdd,
    delete: this.stDelete,
    columns: {
      remark: {
        title: '备注'
      }
    }
  };

  // 建议维修项目表头
  suggestedMaintanceSettings = {
    attr: this.stAttr,
    filter: this.stFilter,
    actions: this.stActions,
    add: this.stAdd,
    delete: this.stDelete,
    columns: {
      name: {
        title: '建议维修项目'
      },
      oprationTime: {
        title: '操作时间'
      },
      remark: {
        title: '备注'
      }
    }
  };

  // 挂起的工单
  public unsettledOrders;

  constructor(
    injector: Injector,
    protected service: OrderService,
    private fb: FormBuilder,
  ) {
    super(injector, service);
    this.params = new OrderListRequest();

    // 构建表单
    this.createForm();

    // 获取挂起的订单
    this.unsettledOrders = this.getUnsettledOrders();

    // this.vehicles = this.searchTerms
    //   .debounceTime(300)        // wait 300ms after each keystroke before considering the term
    //   .distinctUntilChanged()   // ignore if next search term is same as previous
    //   .switchMap(term => term   // switch to new observable each time the term changes
    //     // return the http search observable
    //     ? this.service.doVehicleSearch(term)
    //     // or the observable of empty heroes if there was no search term
    //     : Observable.of<Vehicle[]>([]))
    //   .catch(error => {
    //     // TODO: add real error handling
    //     console.log(error);
    //     return Observable.of<Vehicle[]>([]);
    //   });
  }


  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  /**
   * 通过智能表格新增维修项目, 创建事件处理程序
   * @memberOf CreateOrderComponent
   */
  addNewmaintanceItem(evt) {
    const newData = evt.newData;
    const confirm = evt.confirm;

    console.log(newData);

    confirm.resolve();
  }

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
      customerName: '', // 车主
      phone: '', // 车主电话
      createdOnUtc: '', // 进店时间 / 开单时间
      contactUser: '', // 送修人
      contactInfo: '', // 送修人电话
      createdUserName: '', // 服务顾问
      introducer: '', // 介绍人
      introPhone: '', // 介绍人电话
      brand: '', // 品牌
      series: '', // 车系
      model: '', // 车型
      plateNo: '', // 车牌号
      vin: '',
      validate: '', // 验车日期
      type: '', // 维修类型
      expectLeave: '', // 预计交车时间
      mileage: '', // 行驶里程
      lastEnter: '', // 上次进店时间
      location: '', // 维修工位
      nextDate: '', // 建议下次保养日期
      lastMileage: '', // 上次进店里程
      nextMileage: '' // 建议下次保养里程
    });
  }

}
