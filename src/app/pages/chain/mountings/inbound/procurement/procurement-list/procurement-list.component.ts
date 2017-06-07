import { Component, OnInit, ViewChild } from '@angular/core';
import { TypeaheadRequestParams, HqAlerter, PrintDirective } from 'app/shared/directives';
import { ModalDirective } from 'ngx-bootstrap';
import { ProcurementService, ProcurementPrintItem, ProcurementItem, ProcurementRequest } from '../procurement.service';
import { PurchaseInBillDirective } from '../purchase-in-bill.directive';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'hq-procurement-list',
  templateUrl: './procurement-list.component.html',
  styleUrls: ['./procurement-list.component.css']
})
export class ProcurementListComponent implements OnInit {

  @ViewChild(PurchaseInBillDirective)
  private suspendBill: PurchaseInBillDirective;
  @ViewChild('createModal')
  private createModal: ModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild('printer')
  public printer: PrintDirective;
  @ViewChild('form')
  public form: NgForm;
  private generating: boolean;
  private printModel: ProcurementPrintItem;
  private model = new ProcurementRequest();

  constructor(
    private procurementService: ProcurementService,
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

  onCreate(event: ProcurementItem) {
    let exists = this.model.list.find(m => m.productId == event.productId && m.locationId === event.locationId);
    if (exists) {
      Object.assign(exists, event);
    } else {
      this.model.list.push(event);
    }
    //this.createModal.hide();
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
        this.generating = false;
        this.reset();
        return confirm('已生成采购入库单，是否需要打印？') ? data : null;
      })
      .then(code => code && this.procurementService.get(code))
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

  private onProductRemove(item) {
    if (!confirm('确定要删除？')) return;
    let index = this.model.list.indexOf(item);
    this.model.list.splice(index, 1);
  }
}
