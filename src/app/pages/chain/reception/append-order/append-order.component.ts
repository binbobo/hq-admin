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
    this.stDataSource = new LocalDataSource();
    // this.serviceDataSource = Observable
    //   .create((observer: any) => {
    //     observer.next(this.newMaintenanceItem ? this.newMaintenanceItem.serviceName : '');
    //   })
    //   .debounceTime(300)
    //   .distinctUntilChanged()
    //   .mergeMap((token: string) => this.service1.getMaintenanceItemsByName(token));

    // this.suggestDataSource = Observable
    //   .create((observer: any) => {
    //     observer.next(this.newSuggestItem ? this.newSuggestItem.serviceName : '');
    //   })
    //   .debounceTime(300)
    //   .distinctUntilChanged()
    //   .mergeMap((token: string) => this.service1.getMaintenanceItemsByName(token));

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
  // 费用计算相关
  fee = {
    workHour: 0,
    material: 0,
    other: 0,
  };
  // 当前选择的维修项目记录  用于编辑
  selectedItem: any;
  // 当前已经选择的维修项目id列表
  selectedServiceIds: Array<string> = [];

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

  newMaintenanceItemData = [];  //新增维修项目
  newAttachData = [];          //新增附加项目
  newSuggestData = [];        //新增建议维修项目


  // submitAddOrder() {

  //   if (this.newMaintenanceItemData2.length > 0) {
  //     this.appendOrderSheet();
  //     this.alerter.info('增加维修项目成功!', true, 2000);
  //   }
  //   if (this.newAttachItemData.length > 0) {
  //     this.appendAttachSheet();
  //     this.alerter.info('增加附加项目成功!', true, 2000);
  //   }
  //   if (this.newSuggestItemData.length > 0) {
  //     this.appendSuggestSheet();
  //     this.alerter.info('增加建议维修项成功!', true, 2000);
  //   }
  //   this.newMaintenanceItemData2 = [];  //新增维修项目
  //   this.newAttachItemData = [];          //新增附加项目
  //   this.newSuggestItemData = [];        //新增建议维修项目
  //   this.stDataSource.load([]);//清空只能表单数据
  //   this.isableAppend = false;
  // }
  // // 提交维修项目
  // appendOrderSheet() {
  //   const addData: any = {};
  //   console.log(this.newMaintenanceItemData2)
  //   addData.maintenanceItems = this.newMaintenanceItemData2;

  //   this.service1.post(addData).then(() => {
  //     console.log('添加维修项目成功');
  //   }).catch(err => this.alerter.error(err, true, 2000));
  // }
  // // 提交附加项目
  // appendAttachSheet() {
  //   const attachData: any = {};
  //   attachData.maintenanceItems = this.newAttachItemData;
  //   this.service1.post(attachData).then(() => {
  //     console.log('添加附加项目成功');
  //   }).catch(err => this.alerter.error(err, true, 2000));

  // }

  // // 提交建议维修项
  // appendSuggestSheet() {
  //   const suggestData: any = {};
  //   suggestData.maintenanceRecommends = this.newSuggestItemData;
  //   this.service1.suggestpost(suggestData).then(() => {
  //     console.log('添加建议维修项成功');
  //   }).catch(err => this.alerter.error(err, true, 2000));

  // }

  // 编辑维修项目
  onMaintenanceItemEdit(evt, addModal, item) {
    evt.preventDefault();
    // 
    this.selectedItem = item;
    // 当前编辑的维修项目仍然可选
    const index = this.selectedServiceIds.findIndex(elem => elem === item.serviceId);
    if (index > -1) {
      this.selectedServiceIds.splice(index, 1);
    }

    // 显示窗口
    addModal.show();
  }

  onConfirmNewMaintenanceItem(evt, addModal) {
    console.log('新增的维修项目数据为：', evt);

    // 获取维修项目数据
    const data = evt.data;
    if (evt.isEdit && this.selectedItem) {
      // 编辑
      const index = this.newMaintenanceItemData.findIndex((item) => {
        return item.serviceId === this.selectedItem.serviceId;
      });
      // 使用新的元素替换以前的元素
      this.newMaintenanceItemData.splice(index, 1, data);

      // 更新价格
      this.fee.workHour += (parseFloat(data.amount) - parseFloat(this.selectedItem.amount));

      // 清空当前编辑的维修项目记录
      this.selectedItem = null;
    } else {
      // 新增
      this.newMaintenanceItemData.push(data);

      // 费用计算
      this.fee.workHour += parseFloat(data.amount);
    }
    // 记录当前选择的维修项目id
    this.selectedServiceIds = this.newMaintenanceItemData.map(item => item.serviceId);

    addModal.hide();
  }

  // 从表格中删除一条添加的维修项目事件处理程序
  onDelMaintenanceItem(serviceId) {
    this.newMaintenanceItemData.filter((item, index) => {
      if (item.serviceId === serviceId) {
        this.newMaintenanceItemData.splice(index, 1);
        // 费用计算
        this.fee.workHour -= parseFloat(item.amount);
        return;
      }
    });
    this.selectedServiceIds = this.newMaintenanceItemData.map(item => item.serviceId);
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
    console.log(item)
    this.sunspendRequest = JSON.parse(item.data);
    this.suspendedBillId = item.id;
  }
  suspendData: any;
  suspend(event: Event) {


    // Object.assign(this.suspendData, this.orderDetail)
    if (this.sunspendRequest) {
      // Object.assign(this.suspendData, this.sunspendRequest);
    }

    if (!this.suspendData.billCode) {
      alert('请选择工单');
      return false;
    }

    // let el = event.target as HTMLButtonElement;
    // el.disabled = true;
    this.suspendBill.suspend(this.suspendData)
      // .then(() => el.disabled = false)
      .then(() => this.suspendBill.refresh())
      .then(() => this.alerter.success('挂单成功！'))
      .catch(err => {
        // el.disabled = false;
        this.alerter.error(err);
      })
  }

}
