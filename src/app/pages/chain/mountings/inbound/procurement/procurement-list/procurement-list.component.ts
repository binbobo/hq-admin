import { Component, OnInit, ViewChild } from '@angular/core';
import { TypeaheadRequestParams, HqAlerter, PrintDirective, HqModalDirective } from 'app/shared/directives';
import { ProcurementService, ProcurementPrintItem, ProcurementItem, ProcurementRequest } from '../procurement.service';
import { PurchaseInBillDirective } from '../purchase-in-bill.directive';
import { NgForm } from '@angular/forms';
import { SweetAlertService } from "app/shared/services";

@Component({
  selector: 'hq-procurement-list',
  templateUrl: './procurement-list.component.html',
  styleUrls: ['./procurement-list.component.css']
})
export class ProcurementListComponent implements OnInit {

  @ViewChild(PurchaseInBillDirective)
  private suspendBill: PurchaseInBillDirective;
  @ViewChild('createModal')
  private createModal: HqModalDirective;
  @ViewChild('editModal')
  private editModal: HqModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild('printer')
  public printer: PrintDirective;
  @ViewChild('form')
  public form: NgForm;
  private generating: boolean;
  private printModel: ProcurementPrintItem;
  private model = new ProcurementRequest();
  private selectedModel;
  private totalValue: any;

  constructor(
    private procurementService: ProcurementService,
    private sweetAlertService: SweetAlertService,
  ) { }

  ngOnInit() {
  }

  onSuspendSelect(item: { id: string, value: any }) {
    Object.assign(this.model, item.value);
    this.model.suspendedBillId = item.id;
  }

  onSuspendRemove(event) {
    if (event.id === this.model.suspendedBillId) {
      this.reset();
    }
  }

  onCreated(event: any) {
    let data = event.data;
    let exists = this.model.list.find(m => m.productId == data.productId && m.locationId === data.locationId);
    if (exists) {
      Object.assign(exists, data);
    } else {
      this.model.list.push(data);
    }
    this.aggregate();
    if (!event.continuable) {
      this.createModal.hide();
    }
  }

  private aggregate() {
    if (!this.model || !this.model.list) return;
    this.totalValue = { count: 0, price: 0, exTaxPrice: 0, amount: 0, exTaxAmount: 0 };
    this.model.list.forEach(m => {
      this.totalValue.count += +m.count;
      this.totalValue.price += +m.price;
      this.totalValue.exTaxPrice += +m.exTaxPrice;
      this.totalValue.amount += +m.amount;
      this.totalValue.exTaxAmount += +m.exTaxAmount;
    })
  }

  onEdit(model: ProcurementItem) {
    this.selectedModel = model;
    this.editModal.show();
  }

  onUpdated(event: ProcurementItem) {
    let exists = this.model.list.find(m => m.productId == event.productId && m.locationId === event.locationId);
    if (exists) {
      Object.assign(exists, event);
    }
    this.aggregate();
    this.editModal.hide();
  }

  reset() {
    this.model = new ProcurementRequest();
    this.form.reset();
    this.suspendBill.refresh();
  }

  public onProviderSelect(event) {
    this.model.custName = event.name;
    this.model.outunit = event.id;
  }

  suspend(event: Event) {
    this.suspendBill.suspend(this.model)
      .then(() => this.reset())
      .then(() => this.alerter.success('挂单成功！'))
      .catch(err => {
        this.alerter.error(err);
      })
  }

  generate(event: Event) {
    this.generating = true;
    this.procurementService.generate(this.model)
      .then(data => {
        this.sweetAlertService.confirm({ text: '已生成采购入库单，是否需要打印？' })
          .then(() => {
            data && this.procurementService.get(data)
              .then(data => {
                if (data) {
                  this.printModel = data;
                  setTimeout(() => this.printer.print(), 300);
                }
              })
              .then(() => {
                this.generating = false;
                this.reset();
              })
          }, () => {
            this.generating = false;
            this.reset();
          })
      })
      .catch(err => {
        this.generating = false;
        this.alerter.error(err);
      })
  }

  private onRemove(item) {
    this.sweetAlertService.confirm({ text: '是否确认删除该条入库信息！', type: 'warning' })
      .then(() => {
        let index = this.model.list.indexOf(item);
        this.model.list.splice(index, 1);
        this.aggregate();
      }, () => { })
  }
}
