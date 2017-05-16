import { Component, OnInit, ViewChild } from '@angular/core';
import { HqAlerter, PrintDirective } from 'app/shared/directives';
import { SalesListItem, SalesService, SalesListRequest, SalesPrintItem } from '../sales.service';
import { SelectOption, PagedResult } from 'app/shared/models';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { SuspendBillDirective } from "app/pages/chain/chain-shared";
import { Location } from '@angular/common';

@Component({
  selector: 'hq-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})
export class SalesListComponent implements OnInit {
  @ViewChild(SuspendBillDirective)
  private suspendBill: SuspendBillDirective;
  @ViewChild('createModal')
  private createModal: ModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild('printer')
  public printer: PrintDirective;
  private salesmen: Array<SelectOption>;
  private printModel: SalesPrintItem;
  private model: SalesListRequest = new SalesListRequest();


  constructor(
    private salesService: SalesService,
    private location: Location
  ) { }

  ngOnInit() {
    this.salesService.getSalesmanOptions()
      .then(data => this.salesmen = data)
      .then(data => this.reset())
      .catch(err => this.alerter.error(err));
  }

  onCreate(event: SalesListItem) {
    this.model.list.push(event);
    this.createModal.hide();
  }

  onSuspendSelect(item: { id: string, value: any }) {
    console.log(item)
    this.reset();
    Object.assign(this.model, item.value);
    this.model.suspendedBillId = item.id;
  }

  onSuspendRemove(event) {
    if (event.id === this.model.suspendedBillId) {
      this.reset();
    }
  }

  reset() {
    this.model = new SalesListRequest();
    if (Array.isArray(this.salesmen) && this.salesmen.length) {
      this.model.seller = this.salesmen[0].value;
    }
  }

  generate(event: Event) {
    if (!this.model.custName) {
      alert('请输入客户名称');
      return false;
    } else if (!this.model.custPhone) {
      alert('请如手机号码');
      return false;
    } else if (!this.model.seller) {
      alert('请选择销售员');
      return false;
    }
    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    this.salesService.generate(this.model)
      .then(data => {
        el.disabled = false;
        this.reset();
        this.suspendBill.refresh();
        return confirm('已生成出库单，是否需要打印？') ? data : null;
      })
      .then(code => code && this.salesService.get(code))
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
      alert('请如手机号码');
      return false;
    } else if (!this.model.seller) {
      alert('请选择销售员');
      return false;
    }
    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    this.suspendBill.suspend(this.model)
      .then(() => el.disabled = false)
      .then(() => this.reset())
      .then(() => this.suspendBill.refresh())
      .then(() => this.alerter.success('挂单成功！'))
      .catch(err => {
        el.disabled = false;
        this.alerter.error(err);
      })
  }

  get columns() {
    return [
      { name: 'custName', title: '客户名称' },
      { name: 'custPhone', title: '手机号码' },
      { name: 'operator', title: '操作人' },
    ]
  }
  cancel() {
    this.location.back();
  }
}
