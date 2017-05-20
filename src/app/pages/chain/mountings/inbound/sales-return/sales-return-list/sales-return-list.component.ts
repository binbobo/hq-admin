import { Component, OnInit, ViewChild } from '@angular/core';
import { SuspendBillDirective } from "app/pages/chain/chain-shared";
import { ModalDirective } from "ngx-bootstrap";
import { Router } from '@angular/router';
import { HqAlerter, PrintDirective, TypeaheadRequestParams } from "app/shared/directives";
import { SelectOption } from "app/shared/models";
import { SalesReturnListRequest, SalesReturnPrintItem, SalesReturnService, SalesReturnListItem, CustomerRequest, BillCodeRequest } from "../sales-return.service";
import { Location } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'hq-sales-return-list',
  templateUrl: './sales-return-list.component.html',
  styleUrls: ['./sales-return-list.component.css']
})
export class SalesReturnListComponent implements OnInit {

  private returnData = [];


  @ViewChild(SuspendBillDirective)
  private suspendBill: SuspendBillDirective;
  @ViewChild('createModal')
  private createModal: ModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild('printer')
  public printer: PrintDirective;
  private salesmen: Array<SelectOption>;
  private printModel: SalesReturnPrintItem;
  private model: SalesReturnListRequest = new SalesReturnListRequest();
  // private model;

  constructor(
    private salesReturnService: SalesReturnService,
    private location: Location
  ) { }

  ngOnInit() {
    // this.salesReturnService.getSalesmanOptions()
    //   .then(data => this.salesmen = data)
    //   .then(data => this.reset())
    //   .catch(err => this.alerter.error(err));
  }
  //选择退库单号
  onItemCodeSelect(event) {
    console.log('退库单号详细数据', event);
    // this.OriginalBillId = event.id;
    // this.billCode = event.billCode;
    this.returnData = [];
    let item = new BillCodeRequest();
    // console.log('iiiiiiii',item);
    this.salesReturnService.getSaleDetailsList(item)
      .then(data => {
        console.log('iiiiii配件信息', data);
        // this.model = data.data;
      })
      .catch(err => Promise.reject(`获取配件信息失败：${err}`));
  }
  //选择客户名称
  onItemNameSelect(event) {
    console.log('客户详细数据', event);
    // this.OriginalBillId = event.id;
    // this.billCode = event.billCode;

  }
  //客户名称模糊查询
  public get nameSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new CustomerRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      // console.log('ppppppppp',p);
      return this.salesReturnService.getCustomerPagedList(p);
    };
  }
  //客户信息列表
  get itemNameColumns() {
    return [
      { name: 'customerName', title: '客户名称' },
      { name: 'phone', title: '手机号' },
    ];
  }
  //退库单号模糊查询
  public get codeSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new BillCodeRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      // console.log('ppppppppp',p);
      return this.salesReturnService.getBillCodePagedList(p);
    };
  }
  //退库单号列表
  get itemCodeColumns() {
    return [
      { name: 'billCode', title: '销售退库单号' },
    ];
  }
  //退库操作
  OnCreatBound(item, id) { }
  //删除操作
  onDelCreat(i) {
    this.returnData.splice(i, 1);
  }
  //提交数据
  onCreate(event: SalesReturnListItem) {
    this.model.list.push(event);
    this.createModal.hide();
  }
  //选择挂单信息
  onSuspendSelect(item: { id: string, value: any }) {
    // this.reset();
    Object.assign(this.model, item.value);
    this.model.suspendedBillId = item.id;
  }

  // reset() {
  //   this.model = new SalesReturnListRequest();
  //   if (Array.isArray(this.salesmen) && this.salesmen.length) {
  //     this.model.seller = this.salesmen[0].value;
  //   }
  // }
  //生成退料单
  createReturnList(event: Event) {
    if (!this.model.custName) {
      alert('请输入客户名称');
      return false;
    } else if (!this.model.seller) {
      alert('请选择销售员');
      return false;
    }
    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    console.log(JSON.stringify(this.model));
    this.salesReturnService.createReturnList(this.model)
      .then(data => {
        el.disabled = false;
        // this.reset();
        this.suspendBill.refresh();
        return confirm('已生成出库单，是否需要打印？') ? data : null;
      })
      .then(code => code && this.salesReturnService.get(code))
      .then(data => {
        if (data) {
          this.printModel = data;
          setTimeout(() => this.printer.print(), 300);
        }
      })
      .catch(err => {
        el.disabled = false;
        this.alerter.error(err);
      })
  }
  //挂单
  suspend(event: Event) {
    if (!this.model.custName) {
      alert('请输入客户名称');
      return false;
    } else if (!this.model.custPhone) {
      alert('请输入手机号码');
      return false;
    } else if (!this.model.seller) {
      alert('请选择销售员');
      return false;
    }
    if (confirm('是否确认挂单？')) {
      let el = event.target as HTMLButtonElement;
      el.disabled = true;
      let createTime = new Date();
      this.model.createBillDateTime = moment(createTime).format('YYYY-MM-DD hh:mm:ss');
      // console.log(this.model);
      this.suspendBill.suspend(this.model)
        .then(() => el.disabled = false)
        .then(() => this.suspendBill.refresh())
        // .then(() => this.reset())
        .then(() => this.alerter.success('挂单成功！'))
        .catch(err => {
          el.disabled = false;
          this.alerter.error(err);
        })
    }
  }
  //挂单列表
  get columns() {
    return [
      { name: 'custName', title: '客户名称' },
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
