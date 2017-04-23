import { Component, ViewChild, OnInit, Injector } from '@angular/core';
import { DataList } from '../../../shared/models/data-list';
import { OrderService, OrderListRequest, Order, Vehicle, MaintenanceItem, MaintenanceType } from '../order.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';
import 'rxjs/add/observable/of';
import { AppendOrderService, AppendOrderSearch, SearchReturnData } from "./append-order.service";
import { PagedResult } from "app/shared/models";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-append-order',
  templateUrl: './append-order.component.html',
  styleUrls: ['./append-order.component.css'],
  providers: [AppendOrderService]
})

export class AppendOrderComponent extends DataList<Order> {



  // 维修项目
  serviceOutputs;

  //附加项目
  attachServiceOutputs;

  //建议维修项
  suggestServiceOutputs;

  //上次维修记录
  lastManufactureDetailOutput;

  //客户回访记录
  feedBackInfosOutput;

  // 根据工单号或者车牌号模糊搜索查询  begin
  private source: PagedResult<any>;

  public stateCtrl: FormControl = new FormControl();

  public myForm: FormGroup = new FormGroup({
    state: this.stateCtrl
  });


  public plateNoData: Observable<SearchReturnData>;


  OnSearchClick(e) {
    this.SearchappendList = e.item;
  }

  private SearchappendList = {}

  constructor(
    injector: Injector,
    protected service: OrderService,
    protected service1: AppendOrderService,
    private fb: FormBuilder,
  ) {
    super(injector, service);
    this.params = new OrderListRequest();

    // let p = new AppendOrderSearch();

    // service1.getAppendOrderParma(p).then(data => data);

    this.plateNoData = Observable
      .create((observer: any) => {
        observer.next(this.myForm.controls.state.value);
      })
      .debounceTime(300)
      .distinctUntilChanged()
      .mergeMap((token: string) => this.service1.getAppendOrderParma(token))

  }




  // smart table 公共配置 begin
  private stAttr = {
    class: 'table-over'
  };
  private stFilter = {
    inputClass: 'inputFilter'
  }
  private stActions = {
    columnTitle: '操作',
    edit: 'false'
  }
  private stAdd = {
    addButtonContent: '新增',
    createButtonContent: '添加',
    cancelButtonContent: '取消',
    confirmCreate: true    // 添加确认事件必须配置项
  }
  private stDelete = {
    deleteButtonContent: '删除',
    confirmDelete: true

  }
  // smart table配置 end


  // 新增维修项目数据（临时保存）
  newMaintenanceItemData = [];

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

  // 维修项目 
  maintanceItemSettings = {
    attr: this.stAttr,  //可以设置table的id及class
    filter: this.stFilter,   //过滤input的class
    actions: this.stActions,  //设置表格参数
    add: this.stAdd,      //设置功能参数
    deleter: this.stDelete,  //删除功能属性
    columns: {
      serviceName: {
        title: "维修项目名称",
        type: 'html',

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
  }
  //附加项目
  addItemSettings = {
    attr: this.stAttr,  //可以设置table的id及class
    filter: this.stFilter,   //过滤input的class
    actions: this.stActions,  //设置表格参数
    add: this.stAdd,      //设置功能参数
    deleter: this.stDelete,  //删除功能属性
    columns: {
      note: {
        title: '备注'
      }
    }
  }

  // 建议维修项
  suggestedMaintanceSettings = {
    attr: this.stAttr,  //可以设置table的id及class
    filter: this.stFilter,   //过滤input的class
    actions: this.stActions,  //设置表格参数
    add: this.stAdd,      //设置功能参数
    deleter: this.stDelete,  //删除功能属性
    columns: {
      suggest: {
        title: '建议维修项目'
      },
      time: {
        title: "操作时间"
      },
      note: {
        title: "备注"
      }
    }
  }

}
