import { Component, OnInit, ViewChild } from '@angular/core';
import { HqAlerter, PrintDirective, TypeaheadRequestParams } from 'app/shared/directives';
import { SalesListItem, SalesService, SalesListRequest, SalesPrintItem } from '../sales.service';
import { SelectOption, PagedResult } from 'app/shared/models';
import { ModalDirective } from 'ngx-bootstrap';
import { Router } from '@angular/router';
import { NgForm } from "@angular/forms";
import { SalesOutBillDirective } from '../sales-out-bill.directive';

@Component({
  selector: 'hq-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})
export class SalesListComponent implements OnInit {
  @ViewChild(SalesOutBillDirective)
  private suspendBill: SalesOutBillDirective;
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
    if (event.count > event.stockCount) {
      alert('所选配件已超过当前库位最大库存量，请减少销售数量或者选择其它库位中的配件！')
      return false;
    }
    let exists = this.model.list.find(m => m.productId == event.productId && m.locationId === event.locationId);
    if (exists) {
      Object.assign(exists, event);
    } else {
      this.model.list.push(event);
    }
    this.createModal.hide();
  }

  onSuspendSelect(item: { id: string, value: any }) {
    this.model = new SalesListRequest();
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
    this.suspendBill.refresh();
    this.form.reset();
    if (Array.isArray(this.salesmen) && this.salesmen.length) {
      setTimeout(() => this.model.seller = this.salesmen[0].value, 100);
    }
  }

  generate(event: Event) {
    this.generating = true;
    this.salesService.generate(this.model)
      .then(data => {
        this.generating = false;
        this.reset();
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
      .then(() => this.alerter.success('挂单成功！'))
      .catch(err => {
        el.disabled = false;
        this.alerter.error(err);
      })
  }

  private onProductRemove(item) {
    if (!confirm('确定要删除？')) return;
    let index = this.model.list.indexOf(item);
    this.model.list.splice(index, 1);
  }

  private onCustomerSelect(event) {
    this.model.custName = event.name;
    this.model.custPhone = event.phone;
  }

}
