import { Component, OnInit, ViewChild } from '@angular/core';
import { HqAlerter, PrintDirective } from 'app/shared/directives';
import { SalesListItem, SalesService, SalesListRequest } from '../sales.service';
import { SelectOption, PagedResult } from 'app/shared/models';
import { ModalDirective } from 'ngx-bootstrap';
import { SuspendedBillsService, GenerateSuspendedBillResponse, SuspendedBillItem } from '../../../suspended-bills.service';

@Component({
  selector: 'hq-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.css']
})
export class SalesListComponent implements OnInit {

  private readonly SuspendType = 'IU';
  @ViewChild('createModal')
  private createModal: ModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild('printer')
  public printer: PrintDirective;
  private salesmen: Array<SelectOption>;
  private items: Array<SalesListItem> = [];
  private model: SalesListRequest = new SalesListRequest();
  private suspendedItems: PagedResult<SuspendedBillItem<SalesListRequest>>;

  constructor(
    private salesService: SalesService,
    private suspendService: SuspendedBillsService
  ) { }

  ngOnInit() {
    this.salesService.getSalesmanOptions()
      .then(data => this.salesmen = data)
      .then(data => data.length && (this.model.seller = data[0].value))
      .catch(err => this.alerter.error(err));
    this.loadSuspendedBills();
  }

  private loadSuspendedBills() {
    this.suspendService.getSuspendedBills(this.SuspendType)
      .then(data => this.suspendedItems = data)
      .catch(err => console.error(err));
  }

  onCreate(event: SalesListItem) {
    this.items.push(event);
    this.createModal.hide();
    this.model.list = this.items;
  }

  generate(event: Event) {
    console.log(this.model);
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
      .then(() => el.disabled = false)
      .then(() => this.loadSuspendedBills())
      .catch(err => {
        el.disabled = false;
        this.alerter.error(err);
      })
  }

  print() {
    this.printer.print();
  }
}
