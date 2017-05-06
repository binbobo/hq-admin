import { Component, OnInit, ViewChild } from '@angular/core';
import { HqAlerter, PrintDirective } from 'app/shared/directives';
import { SalesListItem, SalesService, SalesListRequest } from '../sales.service';
import { SelectOption } from 'app/shared/models';
import { ModalDirective } from 'ngx-bootstrap';
import { SuspendedBillsService } from '../../../suspended-bills.service';

@Component({
  selector: 'hq-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})
export class SalesListComponent implements OnInit {
 
  public alert(): void {
    alert();
  }

  private readonly SuspendType = 'VW';
  @ViewChild('createModal')
  private createModal: ModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild('printer')
  public printer: PrintDirective;
  private salesmen: Array<SelectOption>;
  private items: Array<SalesListItem> = [];
  private model: SalesListRequest = new SalesListRequest();

  constructor(
    private salesService: SalesService,
    private suspendService: SuspendedBillsService
  ) { }

  ngOnInit() {
    this.salesService.getSalesmanOptions()
      .then(data => this.salesmen = data)
      .catch(err => this.alerter.error(err));
  }

  onCreate(event: SalesListItem) {
    this.items.push(event);
    this.createModal.hide();
    this.model.list = this.items;
  }

  onSellerSelect(event: Event) {
    let el = event.target as HTMLSelectElement;
    this.model.seller = el.value;
  }

  generate(event: Event) {
    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    this.salesService.generate(this.model)
      .then(() => el.disabled = false)
      .then(() => confirm('已生成出库单，是否需要打印？'))
      .then(confirm => confirm && this.print())
      .catch(err => {
        el.disabled = false;
        this.alerter.error(err);
      })
  }

  suspend(event: Event) {
    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    this.suspendService.suspend(this.model, this.SuspendType)
      .catch(err => {
        el.disabled = false;
        this.alerter.error(err);
      })
  }

  print() {
    this.printer.print();
  }
}
