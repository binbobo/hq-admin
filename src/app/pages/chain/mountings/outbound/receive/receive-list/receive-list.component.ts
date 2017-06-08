import { Component, OnInit, ViewChild } from '@angular/core';
import { HqAlerter, PrintDirective, HqModalDirective } from 'app/shared/directives';
import { SelectOption, PagedResult } from 'app/shared/models';
import { ReceiveService, ReceiveListRequest, ReceiveListItem, ReceivePrintItem } from '../receive.service';
import { ReceiveOutBillDirective } from '../receive-out-bill.directive';

@Component({
  selector: 'hq-receive-list',
  templateUrl: './receive-list.component.html',
  styleUrls: ['./receive-list.component.css']
})
export class ReceiveListComponent implements OnInit {
  @ViewChild(ReceiveOutBillDirective)
  private suspendBill: ReceiveOutBillDirective;
  @ViewChild('createModal')
  private createModal: HqModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild('printer')
  public printer: PrintDirective;
  private employees: Array<SelectOption>;
  private departments: Array<SelectOption>;
  private printModel: ReceivePrintItem;
  private model: ReceiveListRequest = new ReceiveListRequest();
  private generating: boolean;

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
    if (event.count > event.stockCount) {
      alert('所选配件已超过当前库位最大库存量，请减少领用数量或者选择其它库位中的配件！')
      return false;
    }
    let exists = this.model.list.find(m => m.productId == event.productId && m.locationId === event.locationId);
    if (exists) {
      Object.assign(exists, event);
    } else {
      this.model.list.push(event);
    }
    // this.createModal.hide();
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
    this.generating = true;
    this.receiveService.generate(this.model)
      .then(data => {
        this.generating = false;
        this.reset();
        return confirm('已生成内部领料单，是否需要打印？') ? data : null;
      })
      .then(code => code && this.receiveService.get(code))
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

  reset() {
    this.model = new ReceiveListRequest();
    this.suspendBill.refresh();
    if (Array.isArray(this.employees) && this.employees.length) {
      this.model.takeUser = this.employees[0].value;
    }
    if (Array.isArray(this.departments) && this.departments.length) {
      this.model.takeDepart = this.departments[0].value;
    }
  }

  suspend(event: Event) {
    let reveiver = this.employees.find(m => m.value == this.model.takeUser);
    let department = this.departments.find(m => m.value == this.model.takeDepart);
    this.model['reveiver'] = reveiver && reveiver.text;
    this.model['department'] = department && department.text;
    this.suspendBill.suspend(this.model)
      .then(() => this.reset())
      .then(() => this.alerter.success('挂单成功！'))
      .catch(err => {
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
      .then(() => {
        if (Array.isArray(this.departments) && this.departments.length) {
          this.model.takeDepart = this.departments[0].value;
        }
      })
      .catch(err => this.alerter.error(err));
  }

  private onProductRemove(item) {
    if (!confirm('确定要删除？')) return;
    let index = this.model.list.indexOf(item);
    this.model.list.splice(index, 1);
  }
}

