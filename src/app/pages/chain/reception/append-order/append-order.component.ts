import { Component, ViewChild, OnInit, Injector } from '@angular/core';
import { OrderService, OrderListRequest, Order, Vehicle, MaintenanceItem, MaintenanceType } from '../order.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HqAlerter } from 'app/shared/directives';
import { TabsetComponent } from 'ngx-bootstrap';
import 'rxjs/add/observable/of';
import { AppendOrderService, AppendOrderSearch, SearchReturnData, AppendItemSearchRequest } from "./append-order.service";
import { PagedResult, StorageKeys } from "app/shared/models";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { LocalDataSource } from "ng2-smart-table";
import { TypeaheadRequestParams } from "app/shared/directives";
import * as moment from 'moment';
import { CustomMaintanceItemEditorComponent } from "app/pages/chain/reception/create-order/custom-maintance-item-editor.component";
@Component({
  selector: 'app-append-order',
  templateUrl: './append-order.component.html',
  styleUrls: ['./append-order.component.css'],
  providers: [AppendOrderService]
})

export class AppendOrderComponent {
  otherFee = 0;
  materialFee = 0;
  sumFee = 0;
  workHourFee = 0;
  isShowAppend = false;
  isableAppend = false;
  stDataSource: LocalDataSource;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  constructor(
    protected service1: AppendOrderService
  ) {
    this.stDataSource = new LocalDataSource();
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
  private maintenanceId: any;
  public get typeaheadColumns() {
    return [
      { name: 'plateNo', title: '车牌号' },
      { name: 'id', title: '工单号' }
    ];
  }

  public onTypeaheadSelect($event) {
    this.isShowAppend = true;
    this.SearchappendList = $event;
    this.listId = $event.id;

    // this.params.id = $event.id;
    // this.onLoadList();
    this.service1.get(this.listId)
      .then(data => {
        this.maintenanceId = data.id;
        //维修项目
        this.maintenanceProjectData = data.serviceOutputs;
        (this.maintenanceProjectData).forEach((item, index) => {
          this.workHourFee += item.amount;
          this.sumFee += this.workHourFee;

        })
        //附加项目
        this.attachServiceOutputs = data.attachServiceOutputs;
        // // //建议维修项
        this.suggestServiceOutputs = data.suggestServiceOutputs;
        // // 上次维修记录
        this.lastManufactureDetailOutput = data.lastManufactureDetailOutput;
        this.lastDataProjectList = data.lastManufactureDetailOutput.serviceOutputs;
        this.lastRepairList = data.lastManufactureDetailOutput.productOutputs;
        this.lastAddList = data.lastManufactureDetailOutput.attachServiceOutputs;
        this.lastSuggestList = data.lastManufactureDetailOutput.suggestServiceOutputs;
        // // 客户回访记录
        // this.feedBackInfosOutput = data.feedBackInfosOutput;

      });
  }

  public get typeaheadSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new AppendItemSearchRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.service1.getAppendOrderParma(p);
    };
  }

  private SearchappendList = {}

  newMaintenanceItemData = [];  //新增维修项目
  newAttachData = [];          //新增附加项目
  newSuggestData = [];        //新增建议维修项目

  submitAddOrder() {
    if (this.newMaintenanceItemData.length > 0) {
      this.appendOrderSheet();
    }
    if (this.newAttachData.length > 0) {
      this.appendAttachSheet();
    }
    if (this.newSuggestData.length > 0) {
      this.appendSuggestSheet()
    }
    this.newMaintenanceItemData = [];  //新增维修项目
    this.newAttachData = [];          //新增附加项目
    this.newSuggestData = [];        //新增建议维修项目
    this.alerter.info('增项成功!', true, 2000);
    this.stDataSource.load([]);//清空只能表单数据
    this.isableAppend = false;
  }
  // 提交维修项目
  appendOrderSheet() {
    const addData: any = {};
    addData.maintenanceItems = this.newMaintenanceItemData;
    this.service1.post(addData).then(() => {
      console.log('添加维修项目成功');
    }).catch(err => this.alerter.error(err, true, 2000));
  }
  // 提交附加项目
  appendAttachSheet() {
    const attachData: any = {};
    attachData.maintenanceItems = this.newAttachData;
    this.service1.post(attachData).then(() => {
      console.log('添加附加项目成功');
    }).catch(err => this.alerter.error(err, true, 2000));

  }
  // 提交建议维修项
  appendSuggestSheet() {
    const suggestData: any = {};
    suggestData.maintenanceRecommends = this.newSuggestData;
    this.service1.suggestpost(suggestData).then(() => {
      console.log('添加建议维修项成功');
    }).catch(err =>this.alerter.error(err, true, 2000));

  }
  /**
 * 通过智能表格新增维修项目, 添加按钮点击事件处理程序
 * @memberOf CreateOrderComponent
 */
  addNewmaintanceItem(evt) {
    // 获取新增的维修工项记录
    const newData = evt.newData;
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
    newData.maintenanceId = this.maintenanceId;
    newData.amount = newData.workHour * newData.price * (newData.discount / 100); // 金额 = 工时*单价*折扣率
    newData.operationTime = moment().format('YYYY-MM-DD hh:mm:ss'); // 默认为当前时间
    newData.type = '3';  // 类型 3表示维修新增
    // 添加维修项目
    this.newMaintenanceItemData.push(newData);
    this.maintenanceProjectData.push(newData);
    // 计算工时费
    this.workHourFee += newData.money;
    this.sumFee = this.workHourFee + this.materialFee + this.otherFee;
    // 数据合法, 允许添加
    evt.confirm.resolve(newData);
    if (this.newMaintenanceItemData.length > 0) {
      this.isableAppend = true;
    }
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
        return;
      }
    });
  }

  /**
  * 通过智能表格新增维修附加项目,
  * @memberOf CreateOrderComponent
  */
  addAttachItem(evt) {

    const newData = evt.newData;
    if (!newData.description) {
      return;
    }
    newData.serviceName = newData.description;
    newData.serviceId = sessionStorage.getItem(StorageKeys.MaintanceItemId); // 维修项目id
    newData.maintenanceId = this.maintenanceId; //工单id
    newData.type = '2';  // 类型2表示附加项目
    // 添加维修项目
    this.newAttachData.push(newData);
    this.attachServiceOutputs.push(newData);
    // 数据合法, 允许添加
    evt.confirm.resolve(newData);
    if (this.newAttachData.length > 0) {
      this.isableAppend = true;
    }
  }
  /**
  * 通过智能表格删除附加项目
  * @memberOf CreateOrderComponent
  */
  deleteAttachItem(evt) {
    // 确认删除
    evt.confirm.resolve();
  }

  /**
  * 通过智能表格新增建议维修项目,
  * @memberOf CreateOrderComponent
  */
  suggestItem(evt) {
    const newData = evt.newData;
    if (!newData.content) {
      return;
    }
    newData.operateDateTime = moment().format('YYYY-MM-DD hh:mm:ss'); // 默认为当前时间
    newData.maintenanceId = this.maintenanceId; //工单id
    this.newSuggestData.push(newData);
    this.suggestServiceOutputs.push(newData)
    // 数据合法, 允许添加
    evt.confirm.resolve(newData);
    if (this.newSuggestData.length > 0) {
      this.isableAppend = true;
    }
  }
  /**
  * 通过智能表格删除建议维修项目
  * @memberOf CreateOrderComponent
  */
  deletsuggestItem(evt) {
    // 确认删除
    evt.confirm.resolve();
  }

  // 智能表格配置维修项目 
  maintanceItemSettings = {
    columns: {
      serviceName: {
        title: "维修项目名称",
        filter: false,
        type: 'html',
        editor: {
          type: 'custom',
          component: CustomMaintanceItemEditorComponent
        },
      },
      workHour: {
        title: '维修工时(小时)',
        filter: false
      },
      price: {
        title: '工时单价(元)',
        filter: false
      },
      amount: {
        editable: false,
        title: '金额(元)',  // 需要自己计算：工时 * 单价, 不需要传给后台
        filter: false
      },
      discount: {
        title: '折扣率(%)',
        filter: false
      },
      operationTime: {
        filter: false,
        editable: false,
        title: '操作时间', // 不需要传给后台
      }
    }
  }
  //附加项目
  addItemSettings = {
    columns: {
      description: {
        filter: false,
        title: '备注'
      }
    }
  }

  // 建议维修项
  suggestedMaintanceSettings = {
    columns: {
      content: {
        title: '建议维修项目',
        filter: false,
        editor: {
          type: 'custom',
          component: CustomMaintanceItemEditorComponent
        },
      },
      operateDateTime: {
        editable: false,
        title: "操作时间",
        filter: false
      },
      description: {
        title: "备注",
        filter: false
      }
    }
  }

}
