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
import { TypeaheadRequestParams, PrintDirective } from "app/shared/directives";
import * as moment from 'moment';
import { SuspendBillDirective } from "app/pages/chain/chain-shared";

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
  isableSuspend = false;
  stDataSource: LocalDataSource;
  // 根据名称获取维修项目异步数据源
  public serviceDataSource: Observable<any>;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild(SuspendBillDirective)
  private suspendBill: SuspendBillDirective;
  @ViewChild('printer')
  public printer: PrintDirective;
  constructor(
    protected service1: AppendOrderService
  ) {

  }

  maintenanceProjectData;
  attachServiceOutputs;
  suggestServiceOutputs;

  lastDataProjectList;
  lastRepairList;
  lastAddList;
  lastSuggestList;
  feedBackInfosOutput;
  isLast = true;
  // 费用计算相关
  fee = {
    workHour: 0,
    material: 0,
    other: 0,
  };
  // 当前选择的维修项目记录  用于编辑
  selectedItem: any;
  selectedAttachItem: any;
  selectedSuggestItem: any;
  // 当前已经选择的维修项目列表
  selectedServices: Array<any> = [];
  // 当前已经选择的建议维修项目列表
  selectedSuggestServices: Array<any> = [];
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
    this.isableSuspend = true;

    this.listId = $event.id;
    this.workHourFee = 0;
    this.sumFee = 0;
    console.log($event);
    this.suspendData = $event;
    this.service1.get(this.listId)
      .then(data => {
        console.log(data)
        this.SearchappendList = data;
        this.maintenanceId = data.id;
        //维修项目
        this.maintenanceProjectData = data.serviceOutputs;
        this.suspendData.maintenanceProjectData = this.maintenanceProjectData;
        console.log(this.maintenanceProjectData);
        (this.maintenanceProjectData).forEach((item, index) => {
          this.workHourFee += Number(item.price) * Number(item.workHour);
          this.sumFee += Number(item.amount);
        })
        //附加项目
        this.attachServiceOutputs = data.attachServiceOutputs;
        this.suspendData.attachServiceOutputs = this.attachServiceOutputs;
        // // //建议维修项
        this.suggestServiceOutputs = data.suggestServiceOutputs;
        this.suspendData.suggestServiceOutputs = this.suggestServiceOutputs;
        // // 上次维修记录
        let lastManufactureDetailOutput = data.lastManufactureDetailOutput;
        this.lastDataProjectList = data.lastManufactureDetailOutput.serviceOutputs;
        this.suspendData.lastDataProjectList = this.lastDataProjectList;
        this.lastRepairList = data.lastManufactureDetailOutput.productOutputs;
        this.suspendData.lastRepairList = this.lastRepairList;
        this.lastAddList = data.lastManufactureDetailOutput.attachServiceOutputs;
        this.suspendData.lastAddList = this.lastAddList;
        this.lastSuggestList = data.lastManufactureDetailOutput.suggestServiceOutputs;
        this.suspendData.lastSuggestList = this.lastSuggestList;
        if ((this.lastDataProjectList.length > 0) || (this.lastAddList.length > 0) || (this.lastSuggestList.length > 0)) {
          this.isLast = true;
        } else {
          this.isLast = false;
        }
        // // 客户回访记录
        // this.feedBackInfosOutput = data.feedBackInfosOutput;
        this.newMaintenanceItemData = [];  //新增维修项目清空
        this.newAttachData = [];          //新增附加项目清空
        this.newSuggestData = [];        //新增建议维修项目清空
        this.selectedServices = this.getSelectedServices();
        this.selectedSuggestServices = this.getSelectedSuggestServices();
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
    console.log(this.newMaintenanceItemData);
    this.isableAppend=false;

    this.newSuggestData.forEach(item => {
      item.content = item.serviceName;
    });

    let postData = {
      MaintenanceItems: this.newMaintenanceItemData,
      AttachMaintenanceItems: this.newAttachData,
      MaintenanceRecommends: this.newSuggestData,
      suspendedBillId: this.suspendedBillId
    };

    console.log(postData);
    let dada = JSON.stringify(postData);
    console.log(dada);

    this.service1.put(postData, this.listId).then((result) => {
      this.isableAppend=false;
      let returnData = result.data;
      this.maintenanceProjectData = returnData.serviceOutputs;
      this.suspendData.maintenanceProjectData = this.maintenanceProjectData;
      // (this.maintenanceProjectData).forEach((item, index) => {
      //   this.workHourFee += Number(item.price) * Number(item.workHour);
      //   this.sumFee += Number(item.amount);
      // })
      //附加项目
      this.attachServiceOutputs = returnData.attachServiceOutputs;
      this.suspendData.attachServiceOutputs = this.attachServiceOutputs;
      // // //建议维修项
      this.suggestServiceOutputs = returnData.suggestServiceOutputs;
      this.suspendData.suggestServiceOutputs = this.suggestServiceOutputs;

      this.alerter.info('增项成功!', true, 2000);
      this.suspendBill.refresh();
      // this.initOrderData();
      this.isableSuspend = false;
      this.isableAppend = false;
      this.newSuggestData = [],
        this.newAttachData = [],
        this.newMaintenanceItemData = []
    }).catch(err =>{this.alerter.error(err, true, 2000);this.isableAppend=true;});
  }

  // 编辑维修项目
  onMaintenanceItemEdit(evt, addModal, item) {
    evt.preventDefault();
    // 
    this.selectedItem = item;
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
    let data = evt.data;
    data.type = 3;
    data.price = Number(data.price) * 100;
    data.amount = Number(data.amount) * 100;
    data.maintenanceId = this.maintenanceId;
    if (evt.isEdit && this.selectedItem) {
      // 编辑
      const index = this.newMaintenanceItemData.findIndex((item) => {
        return item.serviceId === this.selectedItem.serviceId;
      });
      // 使用新的元素替换以前的元素
      this.newMaintenanceItemData.splice(index, 1, data);

      // 更新价格
      this.workHourFee += (Number(data.price) * Number(data.workHour) - Number(this.selectedItem.price) * Number(this.selectedItem.workHour));

      this.sumFee += Number(data.amount) - Number(this.selectedItem.amount);

      // 清空当前编辑的维修项目记录
      this.selectedItem = null;
    } else {
      // 新增
      this.newMaintenanceItemData.push(data);
      console.log(data)
      // 费用计算

      this.workHourFee += Number(data.price) * Number(data.workHour);
      this.sumFee += Number(data.amount);

    }
    // 记录当前选择的维修项目
    this.selectedServices = this.getSelectedServices();
    this.selectedSuggestServices = this.getSelectedSuggestServices();
    addModal.hide();
    this.suspendData.newMaintenanceItemData = this.newMaintenanceItemData;
    if (this.newMaintenanceItemData.length > 0 || this.newAttachData.length > 0 || this.newSuggestData.length > 0) {
      this.isableAppend = true;
      this.isableSuspend = true;
    } else {
      this.isableAppend = false;
      this.isableSuspend = false;
    }
  }

  // 从表格中删除一条添加的维修项目事件处理程序
  onDelMaintenanceItem(serviceId) {
    this.newMaintenanceItemData.filter((item, index) => {
      if (item.serviceId === serviceId) {
        this.newMaintenanceItemData.splice(index, 1);
        // 费用计算
        this.workHourFee -= Number(item.price * item.workHour);
        this.sumFee -= Number(item.amount);
        return;
      }
    });
    this.selectedServices = this.getSelectedServices();
    this.selectedSuggestServices = this.getSelectedSuggestServices();
    if (this.newMaintenanceItemData.length > 0 || this.newAttachData.length > 0 || this.newSuggestData.length > 0) {
      this.isableAppend = true;
      this.isableSuspend = true;
    } else {
      this.isableAppend = false;
      this.isableSuspend = false;
    }
    this.suspendData.newMaintenanceItemData = this.newMaintenanceItemData;
  }

  private getSelectedServices() {
    return (this.newMaintenanceItemData.concat(this.maintenanceProjectData)).map(item => {
      return {
        id: item.serviceId,
        name: item.serviceName
      };
    });
  }

  // ----------新增附加项目

  // 新增后返回数据
  onCreateAttach(evt) {

    evt.maintenanceId = this.maintenanceId;
    if (this.selectedAttachItem) {

      // 使用新的元素替换以前的元素
      this.newAttachData.splice(0, 1, evt);
      this.selectedAttachItem = null;
    } else {
      // 新增
      this.newAttachData.push(evt);

    }

    if (this.newMaintenanceItemData.length > 0 || this.newAttachData.length > 0 || this.newSuggestData.length > 0) {
      this.isableAppend = true;
      this.isableSuspend = true;
    } else {
      this.isableAppend = false;
      this.isableSuspend = false;
    }
    this.suspendData.newAttachData = this.newAttachData;
  }

  onAttachEdit(evt, addModal, item) {
    evt.preventDefault();

    this.selectedAttachItem = item;

    // 显示窗口
    addModal.show();
  }
  // 从表格中删除一条添加的附加项目事件处理程序
  onDelAttachItem(i) {
    console.log(i);
    this.newAttachData.splice(i, 1);
    if (this.newMaintenanceItemData.length > 0 || this.newAttachData.length > 0 || this.newSuggestData.length > 0) {
      this.isableAppend = true;
      this.isableSuspend = true;
    } else {
      this.isableAppend = false;
      this.isableSuspend = false;
    }
    this.suspendData.newAttachData = this.newAttachData;
  }


  // -------增加建议维修项
  // 编辑维修项目
  onSuggestItemEdit(evt, addModal, item) {
    evt.preventDefault();
    // 
    this.selectedSuggestItem = item;
    // 当前编辑的维修项目仍然可选
    const index = this.selectedSuggestServices.findIndex(elem => elem.id === item.serviceId);
    if (index > -1) {
      this.selectedSuggestServices.splice(index, 1);
    }

    // 显示窗口
    addModal.show();
  }


  onConfirmNewSuggestItem(evt, addModal) {
    console.log('新增的建议维修项目数据为：', evt);
    evt.maintenanceId = this.maintenanceId;

    if (!this.newSuggestData) {
      this.newSuggestData = []
    }
    // 获取维修项目数据
    const data = evt.data;
    if (evt.isEdit && this.selectedSuggestItem) {
      // 编辑
      const index = this.newSuggestData.findIndex((item) => {
        return item.serviceId === this.selectedSuggestItem.serviceId;
      });
      // 使用新的元素替换以前的元素
      this.newSuggestData.splice(index, 1, data);


      // 清空当前编辑的维修项目记录
      this.selectedSuggestItem = null;
    } else {
      // 新增
      this.newSuggestData.push(data);


    }
    // 记录当前选择的维修项目
    this.selectedSuggestServices = this.getSelectedSuggestServices();
    addModal.hide();
    if (this.newMaintenanceItemData.length > 0 || this.newAttachData.length > 0 || this.newSuggestData.length > 0) {
      this.isableAppend = true;
      this.isableSuspend = true;
    } else {
      this.isableAppend = false;
      this.isableSuspend = false;
    }

    this.suspendData.newSuggestData = this.newSuggestData;
  }

  // 从表格中删除一条添加的维修项目事件处理程序
  onDelSuggestItem(serviceId) {
    this.newSuggestData.filter((item, index) => {
      if (item.serviceId === serviceId) {
        this.newSuggestData.splice(index, 1);
        return;
      }
    });
    this.selectedSuggestServices = this.getSelectedSuggestServices();
    if (this.newMaintenanceItemData.length > 0 || this.newAttachData.length > 0 || this.newSuggestData.length > 0) {
      this.isableAppend = true;
      this.isableSuspend = true;
    } else {
      this.isableAppend = false;
      this.isableSuspend = false;
    }
    this.suspendData.newSuggestData = this.newSuggestData;
  }

  private getSelectedSuggestServices() {
    return (this.newSuggestData.concat(this.newMaintenanceItemData, this.maintenanceProjectData)).map(item => {
      return {
        id: item.serviceId,
        name: item.serviceName
      };
    });
  }



  get columns() {
    return [
      { name: 'billCode', title: '工单号' },
      { name: 'customerName', title: '车主' },
      { name: 'plateNo', title: '车牌号' },
    ]
  }
  private sunspendRequest: any;
  suspendedBillId: any;
  onSuspendSelect(item) {
    this.isShowAppend = true;
    this.isableAppend = true;
    this.isableSuspend = true;
    console.log(item)
    this.sunspendRequest = JSON.parse(item.data);
    this.suspendedBillId = item.id;
    this.SearchappendList = this.sunspendRequest;
    this.listId = this.sunspendRequest.id;
    this.maintenanceProjectData = this.sunspendRequest["maintenanceProjectData"] ? this.sunspendRequest["maintenanceProjectData"] : [];
    this.attachServiceOutputs = this.sunspendRequest["attachServiceOutputs"] ? this.sunspendRequest["attachServiceOutputs"] : [];
    this.suggestServiceOutputs = this.sunspendRequest["suggestServiceOutputs"] ? this.sunspendRequest["suggestServiceOutputs"] : [];
    this.lastDataProjectList = this.sunspendRequest["lastDataProjectList"] ? this.sunspendRequest["lastDataProjectList"] : [];
    this.lastRepairList = this.sunspendRequest["lastRepairList"] ? this.sunspendRequest["lastRepairList"] : [];
    this.lastAddList = this.sunspendRequest["lastRepairList"] ? this.sunspendRequest["lastRepairList"] : [];
    this.lastSuggestList = this.sunspendRequest["lastSuggestList"] ? this.sunspendRequest["lastSuggestList"] : [];
    this.newSuggestData = this.sunspendRequest["newSuggestData"] ? this.sunspendRequest["newSuggestData"] : [];
    this.newAttachData = this.sunspendRequest["newAttachData"] ? this.sunspendRequest["newAttachData"] : [];
    this.newMaintenanceItemData = this.sunspendRequest["newMaintenanceItemData"] ? this.sunspendRequest["newMaintenanceItemData"] : [];

  }
  suspendData = {
    maintenanceProjectData: [],
    attachServiceOutputs: [],
    suggestServiceOutputs: [],
    lastDataProjectList: [],
    lastRepairList: [],
    lastAddList: [],
    lastSuggestList: [],
    billCode: "",
    newSuggestData: [],
    newAttachData: [],
    newMaintenanceItemData: []
  }

  suspend(event: Event) {

    if (this.sunspendRequest) {
      Object.assign(this.suspendData, this.sunspendRequest);
    }

    if (!this.suspendData.billCode) {
      alert('请选择工单');
      return false;
    }
    console.log(this.suspendData);
    // let el = event.target as HTMLButtonElement;
    // el.disabled = true;
    this.suspendBill.suspend(this.suspendData)
      // .then(() => el.disabled = false)
      .then(() => this.suspendBill.refresh())
      .then(() => this.alerter.success('挂单成功！'))
      .then(() => this.initOrderData())
      .catch(err => {
        // el.disabled = false;
        this.alerter.error(err);
      })
  }

  initOrderData() {

    this.isShowAppend = false;
    this.isableAppend = false;
    this.isableSuspend = false;

    // 重置费用
    this.workHourFee = 0;
    this.sumFee = 0;

    // 清空上次维修工单数据
    this.maintenanceProjectData = [],
      this.attachServiceOutputs = [],
      this.suggestServiceOutputs = [],
      this.lastDataProjectList = [],
      this.lastRepairList = [],
      this.lastAddList = [],
      this.lastSuggestList = [],
      this.newSuggestData = [],
      this.newAttachData = [],
      this.newMaintenanceItemData = [],
      this.SearchappendList = []

  }
}