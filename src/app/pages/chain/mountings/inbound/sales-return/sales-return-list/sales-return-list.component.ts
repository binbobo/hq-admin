import { Component, OnInit, ViewChild } from '@angular/core';
import { SuspendBillDirective } from "app/pages/chain/chain-shared";
import { ModalDirective } from "ngx-bootstrap";
import { Router } from '@angular/router';
import { HqAlerter, PrintDirective } from "app/shared/directives";
import { SelectOption } from "app/shared/models";
import { SalesReturnListRequest, SalesReturnPrintItem, SalesReturnService, SalesReturnListItem } from "../sales-return.service";
import { Location } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'hq-sales-return-list',
  templateUrl: './sales-return-list.component.html',
  styleUrls: ['./sales-return-list.component.css']
})
export class SalesReturnListComponent implements OnInit {

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

  constructor(
    private salesReturnService: SalesReturnService,
    private location: Location
  ) { }

  ngOnInit() {
    this.salesReturnService.getSalesmanOptions()
      .then(data => this.salesmen = data)
      .then(data => this.reset())
      .catch(err => this.alerter.error(err));
  }

  onCreate(event: SalesReturnListItem) {
    this.model.list.push(event);
    this.createModal.hide();
  }

  onSuspendSelect(item: { id: string, value: any }) {
    this.reset();
    Object.assign(this.model, item.value);
    this.model.suspendedBillId = item.id;
  }

  reset() {
    this.model = new SalesReturnListRequest();
    if (Array.isArray(this.salesmen) && this.salesmen.length) {
      this.model.seller = this.salesmen[0].value;
    }
  }

  createReturnList(event: Event) {
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
    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    console.log(JSON.stringify(this.model));
    this.salesReturnService.createReturnList(this.model)
      .then(data => {
        el.disabled = false;
        this.reset();
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
        .then(() => this.reset())
        .then(() => this.alerter.success('挂单成功！'))
        .catch(err => {
          el.disabled = false;
          this.alerter.error(err);
        })
    }
  }

  get columns() {
    return [
      { name: 'custName', title: '客户名称' },
      { name: 'createBillDateTime', title: '开单时间' },
      { name: 'operator', title: '操作人' },
    ]
  }

  cancel() {
    let conf = confirm('你确定需要取消退料吗？');
    if (conf) {
      this.location.back();
    }
  }

}
