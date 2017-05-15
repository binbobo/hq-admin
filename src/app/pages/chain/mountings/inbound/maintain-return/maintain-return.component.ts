import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { DataList, StorageKeys } from "app/shared/models";
import { Router } from "@angular/router";
import { MaintainReturnService, MaintainRequest } from "./maintain-return.service";
import { FormGroup, FormBuilder } from '@angular/forms';
import { TypeaheadRequestParams, HqAlerter } from "app/shared/directives";
import { ModalDirective } from "ngx-bootstrap";
import { SuspendBillDirective } from "app/pages/chain/chain-shared";
@Component({
  selector: 'app-maintain-return',
  templateUrl: './maintain-return.component.html',
  styleUrls: ['./maintain-return.component.css']
})
export class MaintainReturnComponent extends DataList<any>{
  suspendedBillId: any;
  serialData: any;
  @ViewChild('createModal')
  private createModal: ModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild(SuspendBillDirective)
  private suspendBill: SuspendBillDirective;
  billCode: any;
  printId: any;
  productData: any;
  serviceData: any;
  listId: any;
  SearchappendList: any;
  private newItem: any;
  ChooseOrderForm: FormGroup;
  private addNewItem = false;
  params: MaintainRequest;
  isShowCreat = false;
  constructor(
    private router: Router,
    injector: Injector,
    protected service: MaintainReturnService,
    private fb: FormBuilder) {
    super(injector, service)
    this.params = new MaintainRequest();
    // 构建表单
    this.createForm();
  }

  private orderDetail: any;
  public get typeaheadColumns() {
    return [
      { name: 'plateNo', title: '车牌号' },
      { name: 'billCode', title: '工单号' },
      { name: 'customerName', title: '车主' },
      { name: 'brand', title: '品牌' },
      { name: 'model', title: '车型' }
    ];
  }
  suspendData: any;
  // 选择之后根据id查找工单详情并替换数据
  public onPlateNoSelect($event) {
    this.SearchappendList = $event;
    this.listId = $event.id;
    this.billCode = $event.billCode;
    this.suspendData = $event;
    this.service.getOrderItemData(this.listId)
      .then(data => {
        this.orderDetail = data
        this.serviceData = data.serviceOutputs;
        this.productData = data.productOutputs;

        console.log(data)
      });

    this.service.getMainList(this.billCode)
      .then(data => {
        this.serialData = data;
        this.suspendData.serialData = this.serialData;
        this.serialData.sort((a, b) => {
          return a.serialNum - b.serialNum;
        })
      });
    this.newMainData = [];
  }

  // 车牌号模糊搜索接口调用
  public get PlatNoSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new MaintainRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.service.getOrderPageData(p);
    };
  }

  createForm() {
    this.ChooseOrderForm = this.fb.group({
      keyword: '', // 车牌号或车主姓名或工单号
    });
  }
  // 是否取消退料
  finishedOrder(evt, confirmModal) {
    evt.preventDefault();
    // 显示确认框
    confirmModal.show();
  }
  // 取消退料
  onConfirmFinished(confirmModal) {
    confirmModal.hide();
    history.go(-1);
  }

  private newMainData = [];

  private billData: any;
  //生成退料单
  OnCreatReturnBill() {

    this.billData = {
      billCode: this.billCode,
      billId: this.listId,
      suspendedBillId: this.suspendedBillId,
      list: this.newMainData
    }
    let postData = JSON.stringify(this.billData)
    console.log(postData);
    this.service.postReturnBill(postData).then((result) => {
      this.printId = result.data;
      console.log(this.printId);
      this.alerter.info('生成退料单成功', true, 2000);
    }).catch(err => this.alerter.error(err, true, 2000));
  }

  inputData: any;
  currentData: any;
  // 点击退料弹出发料弹框
  OnCreatBound(item) {
    this.isShowCreat = true;
    console.log(item)
    this.inputData = item;
    this.createModal.show();
  }

  onCreate(e) {
    console.log(e);
    if (this.newMainData) {
      // e.maintenanceItemId = "428D37D2-45EA-477B-9B9F-BA01DA11972E";
      // e.locationId = "8ECE0785-A8E8-4E4F-B1DE-B6C3641269B9";
      this.newMainData.push(e);
    } else {
      this.newMainData = []
    }

    this.createModal.hide();
  }
  onDelCreat(i) {
    this.newMainData.splice(i, 1);
  }
  get columns() {
    return [
      { name: 'billCode', title: '工单号' },
      { name: 'customerName', title: '车主' },
      { name: 'plateNo', title: '车牌号' },
    ]
  }
  private sunspendRequest: any;
  onSuspendSelect(item) {
    console.log(item)
    this.sunspendRequest = JSON.parse(item.data);
    this.billCode = this.sunspendRequest["billCode"]
    this.listId = this.sunspendRequest["id"];
    this.orderDetail = this.sunspendRequest;
    this.newMainData = this.sunspendRequest["newMainData"];
    this.serviceData = this.sunspendRequest["serviceData"];
    this.serialData = this.sunspendRequest["serialData"];
    this.suspendedBillId = item.id;
  }

  suspend(event: Event) {
    this.suspendData = {
      newMainData: this.newMainData,
      serviceData: this.serviceData,
      serialData: this.serialData,
      billCode: this.billCode,
      billId: this.listId,
      suspendedBillId: this.suspendedBillId,
      list: this.newMainData
    }

    Object.assign(this.suspendData, this.orderDetail)
    if (this.sunspendRequest) {
      Object.assign(this.suspendData, this.sunspendRequest);
    }
    
    console.log(this.suspendData)
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
