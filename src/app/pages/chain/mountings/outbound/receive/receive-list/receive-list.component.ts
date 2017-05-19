import { Component, OnInit, ViewChild } from '@angular/core';
import { HqAlerter, PrintDirective } from 'app/shared/directives';
import { SelectOption, PagedResult } from 'app/shared/models';
import { ModalDirective } from 'ngx-bootstrap';
import { ReceiveService, ReceiveListRequest, ReceiveListItem, ReceivePrintItem } from '../receive.service';
import { SuspendBillDirective } from 'app/pages/chain/chain-shared';

@Component({
  selector: 'hq-receive-list',
  templateUrl: './receive-list.component.html',
  styleUrls: ['./receive-list.component.css']
})
export class ReceiveListComponent implements OnInit {
  @ViewChild(SuspendBillDirective)
  private suspendBill: SuspendBillDirective;
  @ViewChild('createModal')
  private createModal: ModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild('printer')
  public printer: PrintDirective;
  private employees: Array<SelectOption>;
  private departments: Array<SelectOption>;
  private printModel: ReceivePrintItem;
  private model: ReceiveListRequest = new ReceiveListRequest();

  constructor(
    private receiveService: ReceiveService,
  ) { }

  ngOnInit() {
    this.receiveService.getReceiverOptions()
      .then(data => this.employees = data)
      .then(data => data.length && this.loadDepartments(data[0].value))
      .then(data => this.reset())
      .catch(err => this.alerter.error(err));
  }

  onCreate(event: ReceiveListItem) {
    this.model.list.push(event);
    this.createModal.hide();
  }

  onSuspendSelect(item: { id: string, value: any }) {
    this.reset();
    Object.assign(this.model, item.value);
    this.model.suspendedBillId = item.id;
  }

  onSuspendRemove(event) {
    if (event.id === this.model.suspendedBillId) {
      this.reset();
    }
  }

  generate(event: Event) {
    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    console.log(JSON.stringify(this.model));
    this.receiveService.generate(this.model)
      .then(data => {
        el.disabled = false;
        this.reset();
        return confirm('已生成出库单，是否需要打印？') ? data : null;
      })
      .then(code => code && this.receiveService.get(code))
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

  reset() {
    this.model = new ReceiveListRequest();
    if (Array.isArray(this.employees) && this.employees.length) {
      this.model.takeUser = this.employees[0].value;
    }
    if (Array.isArray(this.departments) && this.departments.length) {
      this.model.takeDepart = this.departments[0].value;
    }
  }

  suspend(event: Event) {
    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    let reveiver = this.employees.find(m => m.value == this.model.takeUser);
    let department = this.departments.find(m => m.value == this.model.takeDepart);
    this.model['reveiver'] = reveiver && reveiver.text;
    this.model['department'] = department && department.text;
    this.suspendBill.suspend(this.model)
      .then(() => this.reset())
      .then(() => el.disabled = false)
      .then(() => this.suspendBill.refresh())
      .then(() => this.alerter.success('挂单成功！'))
      .catch(err => {
        el.disabled = false;
        this.alerter.error(err);
      })
  }

  get columns() {
    return [
      { name: 'reveiver', title: '领用人' },
      { name: 'department', title: '部门' },
    ]
  }

  onReceiverSelect(event: Event) {
    let el = event.target as HTMLSelectElement;
    this.loadDepartments(el.value);
  }

  private loadDepartments(id: string) {
    this.departments = [];
    this.receiveService.getDepartmentsByReceiver(id)
      .then(options => this.departments = options)
      .then(options => this.reset())
      .catch(err => this.alerter.error(err));
  }
}

