import { Component, OnInit, ViewChild } from '@angular/core';
import { HqAlerter, PrintDirective } from 'app/shared/directives';
import { SelectOption } from 'app/shared/models';
import { ModalDirective } from 'ngx-bootstrap';
import { SuspendedBillsService } from '../../../suspended-bills.service';
import { ReceiveService, ReceiveListRequest, ReceiveListItem } from '../receive.service';

@Component({
  selector: 'hq-receive-list',
  templateUrl: './receive-list.component.html',
  styleUrls: ['./receive-list.component.css']
})
export class ReceiveListComponent implements OnInit {

  private readonly SuspendType = 'VW';
  @ViewChild('createModal')
  private createModal: ModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild('printer')
  public printer: PrintDirective;
  private employees: Array<SelectOption>;
  private departments: Array<SelectOption>;
  private items: Array<ReceiveListItem> = [];
  private model: ReceiveListRequest = new ReceiveListRequest();

  constructor(
    private receiveService: ReceiveService,
    private suspendService: SuspendedBillsService
  ) { }

  ngOnInit() {
    this.receiveService.getReceiverOptions()
      .then(data => this.employees = data)
      .then(data => data.length && this.loadDepartments(data[0].value))
      .catch(err => this.alerter.error(err));
  }

  onCreate(event: ReceiveListItem) {
    this.items.push(event);
    this.createModal.hide();
    this.model.list = this.items;
  }

  generate(event: Event) {
    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    this.receiveService.generate(this.model)
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

  onReceiverSelect(event: Event) {
    let el = event.target as HTMLSelectElement;
    this.loadDepartments(el.value);
  }

  private loadDepartments(id: string) {
    this.departments = [];
    this.receiveService.getDepartmentsByReceiver(id)
      .then(options => this.departments = options)
      .catch(err => this.alerter.error(err));
  }

  print() {
    this.printer.print();
  }
}

