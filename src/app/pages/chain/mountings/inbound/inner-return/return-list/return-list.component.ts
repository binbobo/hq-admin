import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { HqAlerter, PrintDirective } from "app/shared/directives";
import { SelectOption, PagedResult } from "app/shared/models";
import { InnerListRequest, InnerListItem, InnerReturnService } from "../inner-return.service";
import { SuspendedBillsService, SuspendedBillItem } from "../../../suspended-bills.service";

@Component({
  selector: 'hq-return-list',
  templateUrl: './return-list.component.html',
  styleUrls: ['./return-list.component.css']
})
export class ReturnListComponent implements OnInit {

  private readonly SuspendType = 'IR';
  @ViewChild('createModal')
  private createModal: ModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild('printer')
  public printer: PrintDirective;
  private employees: Array<SelectOption>;
  private departments: Array<SelectOption>;
  private items: Array<InnerListItem> = [];
  private model: InnerListRequest = new InnerListRequest();
  private suspendedItems;

  constructor(
    private innerReturnService: InnerReturnService,
    private suspendService: SuspendedBillsService
  ) { }


  ngOnInit() {
    this.innerReturnService.getInnerOptions()
      .then(data => this.employees = data)
      .then(data => data.length && this.loadDepartments(data[0].value))
      .catch(err => this.alerter.error(err));
    this.loadSuspendedBills();
  }

  onInnerSelect(event: Event) {
    let el = event.target as HTMLSelectElement;
    this.loadDepartments(el.value);
  }

  createReturnList(event: Event) {
    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    console.log(JSON.stringify(this.model));
    this.innerReturnService.createReturnList(this.model)
      .then(() => el.disabled = false)
      .then(() => confirm('已生成退料单，是否需要打印？'))
      .then(confirm => confirm && this.print())
      .catch(err => {
        el.disabled = false;
        this.alerter.error(err);
      })
  }

  cancel(event: Event) {
    let el = event.target as HTMLButtonElement;
    let conf = confirm('你确定需要取消退料吗？');
    if (conf) {
      history.go(-1);
    }
  }
  private loadSuspendedBills() {
    this.suspendService.getSuspendedBills(this.SuspendType)
      .then(data => {
        // console.log(JSON.stringify(data));
        this.suspendedItems = data})
      .catch(err => console.error(err));
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
  onCreate(event: InnerListItem) {
    this.items.push(event);
    this.createModal.hide();
    this.model.list = this.items;
  }

  private loadDepartments(id: string) {
    this.departments = [];
    this.innerReturnService.getDepartmentsByInner(id)
      .then(options => this.departments = options)
      .catch(err => this.alerter.error(err));
  }

  print() {
    this.printer.print();
  }

}
