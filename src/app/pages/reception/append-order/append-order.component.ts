import { Component, ViewChild, OnInit, Injector } from '@angular/core';
import { DataList } from '../../../shared/models/data-list';
import { OrderService, OrderListRequest, Order, Vehicle, MaintenanceItem, MaintenanceType } from '../order.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';
import 'rxjs/add/observable/of';
import { AppendOrderService, AppendOrderSearch, SearchReturnData } from "./append-order.service";
import { PagedResult } from "app/shared/models";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { LocalDataSource } from "ng2-smart-table";
import { CustomMaintanceItemEditorComponent } from "app/pages/reception/create-order/custom-maintance-item-editor.component";

@Component({
  selector: 'app-append-order',
  templateUrl: './append-order.component.html',
  styleUrls: ['./append-order.component.css'],
  providers: [AppendOrderService]
})

export class AppendOrderComponent extends DataList<Order> {

  constructor(
    injector: Injector,
    protected service: OrderService,
    protected service1: AppendOrderService
  ) {
    super(injector, service);
    this.params = new OrderListRequest();
    // 搜索模糊查询

    this.plateNoData = Observable
      .create((observer: any) => {
        observer.next(this.myForm.controls.state.value);
      })
      .debounceTime(300)
      .distinctUntilChanged()
      .mergeMap((token: string) => this.service1.getAppendOrderParma(token));

    // 根据项目名称获取维修项目

  }

  maintenanceProjectData;
  attachServiceOutputs;
  suggestServiceOutputs;
  lastManufactureDetailOutput;
  lastDataProjectList;
  lastRepairList;
  lastAddList;
  lastSuggestList;
  feedBackInfosOutput;

  // 根据工单号或者车牌号模糊搜索查询  begin
  private source: PagedResult<any>;
  public stateCtrl: FormControl = new FormControl();
  public myForm: FormGroup = new FormGroup({
    state: this.stateCtrl
  });
  public plateNoData: Observable<SearchReturnData>;
  private listId: string;

  OnSearchClick(e) {
    this.SearchappendList = e.item;
    this.listId = (e.item)["id"];
    this.service1.get(this.listId)
      .then(data => {
        //维修项目
        this.maintenanceProjectData = new LocalDataSource(data.serviceOutputs);
        // //附加项目
        this.attachServiceOutputs = new LocalDataSource(data.attachServiceOutputs);
        // //建议维修项
        this.suggestServiceOutputs = new LocalDataSource(data.suggestServiceOutputs);
        // // 上次维修记录
        this.lastManufactureDetailOutput = data.lastManufactureDetailOutput;
        this.lastDataProjectList = data.lastManufactureDetailOutput.serviceOutputs;
        this.lastRepairList = data.lastManufactureDetailOutput.productOutputs;
        this.lastAddList = data.lastManufactureDetailOutput.attachServiceOutputs;
        this.lastSuggestList = data.lastManufactureDetailOutput.suggestServiceOutputs;
        // 客户回访记录
        this.feedBackInfosOutput = new LocalDataSource(data.feedBackInfosOutput);
        console.log(this.maintenanceProjectData, this.attachServiceOutputs, this.suggestServiceOutputs)
      });
  }

  private SearchappendList = {}

  newMaintenanceItemData=[];


  /**
 * 通过智能表格新增维修项目, 添加按钮点击事件处理程序
 * @memberOf CreateOrderComponent
 */
  addNewmaintanceItem(evt) {
    // 获取新增的维修工项记录
    const newData = evt.newData;
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
    actions: {
      delete: false, // 不显示删除按钮
      edit: false,   // 不显示编辑按钮
    },
    columns: {
      serviceName: {
        title: "维修项目名称",
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
        title: '操作时间', // 不需要传给后台
      }
    }
  }
  //附加项目
  addItemSettings = {
    columns: {
      note: {
        title: '备注'
      }
    }
  }

  // 建议维修项
  suggestedMaintanceSettings = {
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
