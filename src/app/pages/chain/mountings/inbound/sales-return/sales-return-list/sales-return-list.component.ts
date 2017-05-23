import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { SuspendBillDirective } from "app/pages/chain/chain-shared";
import { ModalDirective } from "ngx-bootstrap";
import { Router } from '@angular/router';
import { HqAlerter, PrintDirective, TypeaheadRequestParams } from "app/shared/directives";
import { SelectOption, DataList } from "app/shared/models";
import { SalesReturnService, BillCodeRequest, CustomerRequest, SaleDetailsRequest } from "../sales-return.service";
import { Location } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'hq-sales-return-list',
  templateUrl: './sales-return-list.component.html',
  styleUrls: ['./sales-return-list.component.css']
})
export class SalesReturnListComponent extends DataList<any> implements OnInit {

  private salesReturnData = [];//退库数据
  private selectSalesData: any;//销售数据
  private customerId;
  private customerName;
  private customerPhone;
  private billCode;//退库单号
  private billId;
  private billData;//生成退库单
  private originalBillId;
  private suspendData;//挂单数据
  private suspendedBillId;//挂单ID
  private seller;//销售员ID
  private inUnit;//购买方ID
  private outUnit;//销售方ID
  private createLoading = false;//生成退库单按钮加载动画
  private suspendLoading = false;//挂单按钮加载动画
  private isOk = true;//按钮禁用控制

  params: SaleDetailsRequest;

  @ViewChild(SuspendBillDirective)
  private suspendBill: SuspendBillDirective;
  @ViewChild('createModel')
  private createModel: ModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild('printer')
  public printer: PrintDirective;
  // private salesmen: Array<SelectOption>;
  private printModel: any;
  // private model: SalesReturnListRequest = new SalesReturnListRequest();
  // private model;

  constructor(
    injector: Injector,
    private salesReturnservice: SalesReturnService,
  ) {
    super(injector, salesReturnservice);
    this.params = new SaleDetailsRequest();
    this.size = 5;
  }

  ngOnInit() {
    this.lazyLoad = true;
    super.ngOnInit();
    //   // this.salesReturnService.getSalesmanOptions()
    //   //   .then(data => this.salesmen = data)
    //   //   .then(data => this.reset())
    //   //   .catch(err => this.alerter.error(err));
  }
  // //选择退库单号
  onItemCodeSelect(event) {
    console.log('退库单号详细数据', event);
    this.originalBillId = event.id;
    this.billCode = event.billCode;
    this.inUnit = event.inUnit;
    this.outUnit = event.outUnit;
    this.seller = event.seller;

    if (!this.customerId) {
      this.customerId = event.customerId;
      this.customerName = event.customerName;
      this.billId = event.id;
    }
    this.salesReturnData = [];
    this.params.customerId = this.customerId;
    this.params.customerName = this.customerName;
    this.params.billCode = this.billCode;
    this.params.billId = this.billId;
    this.onLoadList();
    // .then(()=>this.model = this.list)
    // let item = new SaleDetailsRequest(this.customerId, this.customerName, this.billCode, this.billId);
    // console.log('iiiiiiii', item);
    // this.salesReturnservice.getPagedList(item)
    //   .then(data => {
    //     console.log('iiiiii配件信息', data);
    //     this.model = data.data;
    //   })
    //   .catch(err => Promise.reject(`获取配件信息失败：${err}`));
  }
  // //选择客户名称
  onItemNameSelect(event) {
    console.log('客户详细数据', event);

    // this.OriginalBillId = event.id;
    // this.billCode = event.billCode;
    this.customerId = event.customerId;
    this.customerName = event.customerName;
    this.customerPhone = event.customerPhone;
    this.billId = event.id;
    this.billCode = null;
    this.list = null;
    this.salesReturnData = [];
  }


  // //客户名称模糊查询
  public get nameSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new CustomerRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.salesReturnservice.getCustomerPagedList(p);
    };
  }
  // //客户信息列表
  get itemNameColumns() {
    return [
      { name: 'customerName', title: '客户名称' },
      { name: 'customerPhone', title: '手机号' },
    ];
  }
  // //退库单号模糊查询
  public get codeSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new BillCodeRequest(this.customerId, params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.salesReturnservice.getBillCodePagedList(p);
    };
  }
  // //退库单号列表
  get itemCodeColumns() {
    return [
      { name: 'billCode', title: '销售退库单号' },
    ];
  }
  // //退库操作
  OnCreatBound(data, id) {
    console.log('弹框数据', data);
    this.selectSalesData = [];
    // this.originalBillId = data.id;
    // this.selectReturnData = data;
    Object.assign(this.selectSalesData, data);

    this.selectSalesData.price = (parseFloat(this.selectSalesData.price) / 100).toFixed(2);
    this.selectSalesData.amount = (parseFloat(this.selectSalesData.amount) / 100).toFixed(2);
    this.selectSalesData.counts = 1;
    console.log('修改后弹框数据', this.selectSalesData);
    this.createModel.show();
  }
  //删除操作
  onDelCreat(e, i) {
    if (confirm('是否要删除该条退库信息！'))
      this.salesReturnData.splice(i, 1);
  }

  historyData: any;
  //提交数据
  onCreate(e) {
    console.log('返回数据', e);
    e.price = parseInt(e.price) * 100;
    e.amount = parseInt(e.amount) * 100;
    this.historyData = this.salesReturnData.filter(item => item.originalId == e.originalId)
    if (this.historyData.length > 0) {
      this.salesReturnData.forEach((item, index) => {
        if (item.originalId == e.originalId) {
          item.count = Number(e.count);
          item.amount = Number(e.amount);
          item.stockCounts = Number(e.stockCounts);
        }
      })
    } else {
      this.salesReturnData.push(e);
      this.isOk = false;
    }
    this.createModel.hide();
  }
  //选择挂单信息
  onSuspendSelect(item) {
    console.log('选择的挂单数据', item);
    // this.reset();
    // Object.assign(this.model, item.value);
    this.suspendedBillId = item.id;
    this.originalBillId = item.value.originalBillId;
    console.log(item.value.originalBillId);
    this.billCode = item.value.billCode;
    this.customerName = item.value.customerName;
    this.customerId = item.value.customerId;
    this.customerPhone = item.value.customerPhone;
    this.list = item.value.model;
    this.salesReturnData = item.value.salesReturnData;
    this.seller = item.value.seller;
    this.inUnit = item.value.inUnit;
    this.outUnit = item.value.outUnit;
    this.isOk = false;
  }

  // reset() {
  //   this.model = new SalesReturnListRequest();
  //   if (Array.isArray(this.salesmen) && this.salesmen.length) {
  //     this.model.seller = this.salesmen[0].value;
  //   }
  // }

  //生成退料单
  createReturnList() {
    // let el = event.target as HTMLButtonElement;
    // el.disabled = true;
    this.isOk = true;
    this.createLoading = true;
    this.billData = {
      originalBillId: this.originalBillId,
      suspendedBillId: this.suspendedBillId,
      billCode: this.billCode,
      customerId: this.customerId,
      seller: this.seller,
      inUnit: this.inUnit,
      outUnit: this.outUnit,
      // returnUser: this.takeUser,
      // returnDepart: this.takeDepartId,
      list: this.salesReturnData,
    }
    console.log(JSON.stringify(this.billData));
    this.salesReturnservice.createReturnList(this.billData)
      .then(data => {
        // el.disabled = false;
        // this.reset();
        this.createLoading = false;
        this.suspendBill.refresh();
        return confirm('已生成出库单，是否需要打印？') ? data : null;
      })
      .then(code => code && this.salesReturnservice.get(code))
      .then(data => {
        if (data) {

          this.printModel = data;
          console.log('打印数据', this.printModel);
          setTimeout(() => this.printer.print(), 300);
        }
      })
      .then(() => {
        this.salesReturnData = [];
        this.list = null;
        this.billCode = null;
        this.customerName = null;
        this.customerPhone = null;
        this.originalBillId = null;
      })
      .catch(err => {
        // el.disabled = false;
        this.alerter.error(err);
      })
  }
  // //挂单
  suspend() {
    if (confirm('是否确认挂单？')) {
      // let el = event.target as HTMLButtonElement;
      // el.disabled = true;
      // let createTime = new Date();
      // this.model.createBillDateTime = moment(createTime).format('YYYY-MM-DD hh:mm:ss');
      // console.log(this.model);

      this.isOk = true;
      this.suspendData = {
        model: this.list,
        salesReturnData: this.salesReturnData,
        billCode: this.billCode,
        customerName: this.customerName,
        customerPhone: this.customerPhone,
        customerId: this.customerId,
        suspendedBillId: this.suspendedBillId,
        originalBillId: this.originalBillId,
        seller: this.seller,
        inUnit: this.inUnit,
        outUnit: this.outUnit,
      }
      console.log(this.suspendData);
      this.suspendBill.suspend(this.suspendData)
        // .then(() => el.disabled = false)
        .then(() => this.suspendBill.refresh())
        // .then(() => this.reset())
        .then(() => {
          this.salesReturnData = [];
          this.list = null;
          this.billCode = null;
          this.customerName = null;
          this.customerPhone = null;
          this.originalBillId = null;
          // this.takeUser = this.employees[0].value;
        })
        .then(() => this.alerter.success('挂单成功！'))
        .catch(err => {
          // el.disabled = false;
          this.isOk = false;
          this.alerter.error(err);
        })
    }
  }
  // //挂单列表
  get columns() {
    return [
      { name: 'customerName', title: '客户名称' },
      { name: 'operator', title: '操作人' },
    ]
  }

  // cancel() {
  //   let conf = confirm('你确定需要取消退料吗？');
  //   if (conf) {
  //     this.location.back();
  //   }
  // }

}
