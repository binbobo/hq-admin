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
  private billData;//生成退库单
  private originalBillId;
  private suspendData;//挂单数据
  private suspendedBillId;//挂单ID
  private createLoading = false;//生成退库单按钮加载动画
  private suspendLoading = false;//挂单按钮加载动画

  params: SaleDetailsRequest;

  @ViewChild(SuspendBillDirective)
  private suspendBill: SuspendBillDirective;
  @ViewChild('createModel')
  private createModel: ModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild('printer')
  public printer: PrintDirective;
  private printModel: any;

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
  }
  // //选择退库单号
  onItemCodeSelect(event) {
    this.originalBillId = event && event.id;
    this.billCode = event && event.billCode;
    if (!this.customerName) {
      this.customerId = event && event.customerID;
      this.customerName = event && event.customerName;
      this.customerPhone = event && event.customerPhone;
    }
    this.salesReturnData = [];
    this.params.customerId = this.customerId;
    this.params.customerName = this.customerName;
    this.params.billCode = this.billCode;
    this.onLoadList();
  }
  // //选择客户名称
  onItemNameSelect(event) {
    this.customerId = event && event.customerId;
    this.customerName = event && event.customerName;
    this.customerPhone = event && event.customerPhone;
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
    if (!this.customerName) {
      this.customerId = null;
    }
    return (params: TypeaheadRequestParams) => {
      let p = new BillCodeRequest(this.customerId, this.customerName, params.text);
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
    this.selectSalesData = [];
    Object.assign(this.selectSalesData, data);
    this.selectSalesData.price = (parseFloat(this.selectSalesData.price) / 100).toFixed(2);
    this.selectSalesData.amount = (parseFloat(this.selectSalesData.amount) / 100).toFixed(2);
    this.selectSalesData.counts = 1;
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
    }
    this.createModel.hide();
  }
  //选择挂单信息
  onSuspendSelect(item) {
    this.suspendedBillId = item.id;
    this.originalBillId = item.value.originalBillId;
    this.billCode = item.value.billCode;
    this.customerName = item.value.customerName;
    this.customerId = item.value.customerId;
    this.customerPhone = item.value.customerPhone;
    this.list = item.value.model;
    this.salesReturnData = item.value.salesReturnData;
  }

  //生成退库单
  createReturnList() {
    this.createLoading = true;
    this.billData = {
      originalBillId: this.originalBillId,
      suspendedBillId: this.suspendedBillId,
      billCode: this.billCode,
      customerId: this.customerId,
      list: this.salesReturnData,
    }
    this.salesReturnservice.createReturnList(this.billData)
      .then(data => {
        this.createLoading = false;
        this.suspendBill.refresh();
        return confirm('已生成退库单，是否需要打印？') ? data : null;
      })
      .then(code => code && this.salesReturnservice.get(code))
      .then(data => {
        if (data) {
          this.printModel = data;
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
        this.alerter.error(err);
      })
  }
  // //挂单
  suspend() {
    if (confirm('是否确认挂单？')) {
      // let createTime = new Date();
      // this.model.createBillDateTime = moment(createTime).format('YYYY-MM-DD hh:mm:ss');
      this.suspendLoading = true;
      this.suspendData = {
        model: this.list,
        salesReturnData: this.salesReturnData,
        billCode: this.billCode,
        customerName: this.customerName,
        customerPhone: this.customerPhone,
        customerId: this.customerId,
        suspendedBillId: this.suspendedBillId,
        originalBillId: this.originalBillId,
      }
      this.suspendBill.suspend(this.suspendData)
        .then(() => this.suspendBill.refresh())
        .then(() => {
          this.salesReturnData = [];
          this.list = null;
          this.billCode = null;
          this.customerName = null;
          this.customerPhone = null;
          this.originalBillId = null;
        })
        .then(() => {
          this.alerter.success('挂单成功！');
          this.suspendLoading = false;
          this.createLoading = false;
        })
        .catch(err => {
          this.suspendLoading = false;
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
