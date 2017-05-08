import { Component, ViewChild, OnInit, Injector } from '@angular/core';
import { OrderService, OrderListRequest, Order, Vehicle, MaintenanceItem, MaintenanceType } from '../order.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HqAlerter } from 'app/shared/directives';
import { TabsetComponent, TypeaheadMatch } from 'ngx-bootstrap';
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

@Component({
  selector: 'app-append-order',
  templateUrl: './append-order.component.html',
  styleUrls: ['./append-order.component.css'],
  providers: [AppendOrderService]
})

export class AppendOrderComponent {
  suggestDataSource: Observable<any>;
  otherFee = 0;
  materialFee = 0;
  sumFee = 0;
  workHourFee = 0;
  isShowAppend = false;
  isableAppend = false;
  stDataSource: LocalDataSource;
  // 根据名称获取维修项目异步数据源
  public serviceDataSource: Observable<any>;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  constructor(
    protected service1: AppendOrderService
  ) {
    this.stDataSource = new LocalDataSource();
    this.serviceDataSource = Observable
      .create((observer: any) => {
        observer.next(this.newMaintenanceItem ? this.newMaintenanceItem.serviceName : '');
      })
      .debounceTime(300)
      .distinctUntilChanged()
      .mergeMap((token: string) => this.service1.getMaintenanceItemsByName(token));

    this.suggestDataSource = Observable
      .create((observer: any) => {
        observer.next(this.newSuggestItem ? this.newSuggestItem.serviceName : '');
      })
      .debounceTime(300)
      .distinctUntilChanged()
      .mergeMap((token: string) => this.service1.getMaintenanceItemsByName(token));

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
      { name: 'billCode', title: '工单号' }
    ];
  }

  public onTypeaheadSelect($event) {
    this.isShowAppend = true;
    this.SearchappendList = $event;
    this.listId = $event.id;


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

  newMaintenanceItemData2 = [];  //新增维修项目
  newAttachData = [];          //新增附加项目
  newSuggestData = [];        //新增建议维修项目


  submitAddOrder() {
    console.log(this.newMaintenanceItemData2)
    if (this.newMaintenanceItemData2.length > 0) {
      this.appendOrderSheet();
      this.alerter.info('增加维修项目成功!', true, 2000);
    }
    if (this.newAttachItemData.length > 0) {
      this.appendAttachSheet();
      this.alerter.info('增加附加项目成功!', true, 2000);
    }
    if (this.newSuggestItemData.length > 0) {
      this.appendSuggestSheet();
      this.alerter.info('增加建议维修项成功!', true, 2000);
    }
    this.newMaintenanceItemData2 = [];  //新增维修项目
    this.newAttachItemData = [];          //新增附加项目
    this.newSuggestItemData = [];        //新增建议维修项目
    this.stDataSource.load([]);//清空只能表单数据
    this.isableAppend = false;
  }
  // 提交维修项目
  appendOrderSheet() {
    const addData: any = {};
    console.log(this.newMaintenanceItemData2)
    addData.maintenanceItems = this.newMaintenanceItemData2;

    this.service1.post(addData).then(() => {
      console.log('添加维修项目成功');
    }).catch(err => this.alerter.error(err, true, 2000));
  }
  // 提交附加项目
  appendAttachSheet() {
    const attachData: any = {};
    attachData.maintenanceItems = this.newAttachItemData;
    this.service1.post(attachData).then(() => {
      console.log('添加附加项目成功');
    }).catch(err => this.alerter.error(err, true, 2000));

  }

  // 提交建议维修项
  appendSuggestSheet() {
    const suggestData: any = {};
    suggestData.maintenanceRecommends = this.newSuggestItemData;
    this.service1.suggestpost(suggestData).then(() => {
      console.log('添加建议维修项成功');
    }).catch(err => this.alerter.error(err, true, 2000));

  }
  /**
 * 新增维修项目, 添加按钮点击事件处理程序
 */
  addNewMaintenanceItem = false; // 维修项目编辑区域是否可见标志
  newMaintenanceItem = null; // 当前编辑的维修项目记录
  // 费用计算相关
  fee = {
    workHour: 0,
    material: 0,
    other: 0,
  };
  addNewmaintanceItem(evt) {
    this.newMaintenanceItem = {
      maintenanceId: this.maintenanceId,
      serviceId: "",
      type: 3, // type 3 表示维修增项
      serviceName: '',
      workHour: '',
      price: '',
      discount: 100,
      amount: '',
      operationTime: moment().format('YYYY-MM-DD hh:mm:ss')
    };
    this.addNewMaintenanceItem = true;
  }
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
  // 确认添加一条维修项目记录 处理程序
  onConfirmAddNewMaintenanceItem(evt?: Event) {
    if (evt) {
      evt.preventDefault();
    }
    if (this.isWorkHourValid() && this.isPriceValid() && this.isDiscountValid()) {
      this.newMaintenanceItem.price = this.newMaintenanceItem.price * 100;
      this.newMaintenanceItem.amount = this.newMaintenanceItem.amount * 100;
      this.newMaintenanceItemData2.push(this.newMaintenanceItem);
      // 维修项目编辑区域不可见
      this.addNewMaintenanceItem = false;

      // 费用计算
      this.fee.workHour += parseFloat(this.newMaintenanceItem.amount) / 100;
      this.isableAppend = true;

    } else {
      // 数据输入不合法
      this.alerter.error('数据输入不合法');
    }
    console.log(this.newMaintenanceItemData2);
  }

  // 从表格中删除一条添加的维修项目事件处理程序
  onDelNewMaintenanceItem(evt, serviceId) {
    evt.preventDefault();

    this.newMaintenanceItemData2.filter((item, index) => {
      if (item.serviceId === serviceId) {
        this.newMaintenanceItemData2.splice(index, 1);
        // 费用计算
        this.fee.workHour -= parseFloat(item.amount) / 100;
        return;
      }
    });

    if (this.newAttachItemData.length == 0 && this.newAttachItemData.length == 0 && this.newMaintenanceItemData2.length == 0) {
      this.isableAppend = false;
    }
    console.log(this.newMaintenanceItemData2);
  }
  private isMaintanceItemSelected = false;
  // 维修项目输入框失去焦点事件处理程序
  onServiceBlur(maintanceItem) {
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
  serviceTypeaheadOnSelect(evt: TypeaheadMatch) {

    // 保存当前选择的维修项目名称
    this.newMaintenanceItem.serviceName = evt.value;
    // 保存当前选择的维修项目id
    this.newMaintenanceItem.serviceId = evt.item.id;
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
      this.newMaintenanceItem.amount = this.newMaintenanceItem.amount.toFixed(2); // 转成分
    }
  }

  /**
  * 新增建议维修项目  
  */
  addNewSuggestItem = false; // 维修项目编辑区域是否可见标志
  newSuggestItemData = []; // 保存所有添加的维修项目记录
  newSuggestItem = null; // 当前编辑的维修项目记录

  addNewSuggestItemData(evt) {
    this.newSuggestItem = {
      serviceName: '',
      content: '',
      maintenanceId: this.maintenanceId,
      description: '',
      operationTime: moment().format('YYYY-MM-DD hh:mm:ss')
    };

    this.addNewSuggestItem = true;
  }

  // 确认添加一条维修项目记录 处理程序
  onConfirmAddNewSuggestItem(evt?: Event) {
    if (evt) {
      evt.preventDefault();
    }
    if (this.newSuggestItem.serviceName) {

      this.newSuggestItemData.push(this.newSuggestItem);
      // 维修项目编辑区域不可见
      this.addNewSuggestItem = false;
      this.isableAppend = true;
    }

    console.log(this.newSuggestItemData)
  }

  // 从表格中删除一条添加的维修项目事件处理程序
  onDelSuggestItem(evt) {
    evt.preventDefault();
    this.newSuggestItemData.filter((item, index) => {
      this.newSuggestItemData.splice(index, 1);
    });


    if (this.newAttachItemData.length == 0 && this.newAttachItemData.length == 0 && this.newMaintenanceItemData2.length == 0) {
      this.isableAppend = false;
    }
    console.log(this.newSuggestItemData)
  }

  // 维修项目输入框失去焦点事件处理程序
  onSuggestBlur(maintanceItem) {
    if (!this.newSuggestItem.serviceId) {
      this.newSuggestItem.serviceName = '';
      this.newSuggestItem.serviceId = '';
    }
    this.isSuggestItemSelected = false;
  }
  // 维修项目输入框值改变事件处理程序
  onSuggestChange() {
    if (!this.isSuggestItemSelected) {
      this.newSuggestItem.serviceId = '';
    }
  }
  isSuggestItemSelected = false;
  // 从下拉列表中选择一个维修项目事件处理程序
  SuggestTypeaheadOnSelect(evt: TypeaheadMatch) {
    console.log(evt)
    // 保存当前选择的维修项目名称
    this.newSuggestItem.serviceName = evt.value;
    this.newSuggestItem.content = evt.value;
    // 保存当前选择的维修项目id
    this.newSuggestItem.serviceId = evt.item.id;
    // 设置维修项目是否已选择标识为true
    this.isSuggestItemSelected = true;
  }
  /**
  * 新增附加项目  
  */
  addNewAttachItem = false; // 维修项目编辑区域是否可见标志
  newAttachItemData = []; // 保存所有添加的维修项目记录
  newAttachItem = null; // 当前编辑的维修项目记录

  addNewAttachItemData(evt) {
    this.newAttachItem = {
      type: 2, // type 1 表示附加项目
      serviceName: '',
      maintenanceId: this.maintenanceId,
      description: ''
    };
    this.addNewAttachItem = true;

  }

  // 确认添加一条维修项目记录 处理程序
  onConfirmAddNewAttachItem(evt?: Event) {
    if (evt) {
      evt.preventDefault();
    }
    if (this.newAttachItem.description) {
      this.newAttachItemData.push(this.newAttachItem);
      // 维修项目编辑区域不可见
      this.addNewAttachItem = false;
    }
    console.log(this.newAttachItemData)
  }

  // 从表格中删除一条添加的维修项目事件处理程序
  onDelAttachItem(evt) {
    evt.preventDefault();
    this.newAttachItemData.filter((item, index) => {
      this.newAttachItemData.splice(index, 1);
    });

    if (this.newAttachItemData.length == 0 && this.newAttachItemData.length == 0 && this.newMaintenanceItemData2.length == 0) {
      this.isableAppend = false;
    }
    console.log(this.newAttachItemData)

  }

}
