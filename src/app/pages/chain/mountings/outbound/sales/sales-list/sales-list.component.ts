import { Component, OnInit, ViewChild } from '@angular/core';
import { HqAlerter, PrintDirective, TypeaheadRequestParams } from 'app/shared/directives';
import { SalesListItem, SalesService, SalesListRequest, SalesPrintItem } from '../sales.service';
import { SelectOption, PagedResult } from 'app/shared/models';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { NgForm } from "@angular/forms";
import { SuspendBillDirective } from "app/pages/chain/chain-shared";

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
  @ViewChild('form')
  private form: NgForm;
  @ViewChild('printer')
  public printer: PrintDirective;
  private salesmen: Array<SelectOption>;
  private printModel: SalesPrintItem;
  private model: SalesListRequest = new SalesListRequest();
  private generating: boolean;

  constructor(
    private salesService: SalesService,
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
    this.generating = true;
    this.salesService.generate(this.model)
      .then(data => {
        this.generating = false;
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
        this.generating = false;
        this.alerter.error(err);
      })
  }

  suspend(event: Event) {
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

  private onProductRemove(item) {
    if (!confirm('确定要删除？')) return;
    let index = this.model.list.indexOf(item);
    this.model.list.splice(index, 1);
  }

  private get customerSource() {
    return 1;
    // return (params: TypeaheadRequestParams) => {
    //   let p = new ProviderListRequest(params.text, params.text);
    //   p.setPage(params.pageIndex, params.pageSize);
    //   return this.providerService.getPagedList(p);
    // };
  }

  private get customerColumns() {
    return [
      { name: '客户名称', title: '客户名称', weight: 1 },
      { name: 'name', title: '手机号' },
    ];
  }

  private onCustomerSelect(event) {
    this.model.custName = event.name;
  }

}
