import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { HqAlerter, PrintDirective } from "app/shared/directives";
import { SelectOption, PagedResult } from "app/shared/models";
import { InnerListRequest, InnerListItem, InnerReturnService, InnerPrintItem } from "../inner-return.service";
import { SuspendBillDirective } from "app/pages/chain/chain-shared";

@Component({
  selector: 'hq-return-list',
  templateUrl: './return-list.component.html',
  styleUrls: ['./return-list.component.css']
})
export class ReturnListComponent implements OnInit {
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
  private model: InnerListRequest = new InnerListRequest();
  private printModel: InnerPrintItem;

  constructor(
    private innerReturnService: InnerReturnService,
  ) { }


  ngOnInit() {
    this.innerReturnService.getInnerOptions()
      .then(data => this.employees = data)
      .then(data => data.length && this.loadDepartments(data[0].value))
      .then(data => this.reset())
      .catch(err => this.alerter.error(err));
  }

  onInnerSelect(event: Event) {
    let el = event.target as HTMLSelectElement;
    this.loadDepartments(el.value);
  }


  createReturnList(event: Event) {
    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    // console.log(this.model);
    this.innerReturnService.createReturnList(this.model)
      .then(data => {
        el.disabled = false;
        this.reset();
        // console.log(data);
        return confirm('已生成出库单，是否需要打印？') ? data : null;
      })
      .then(code => code && this.innerReturnService.get(code))
      .then(data => {
        if (data) {
          this.printModel = data;
          // console.log(this.printModel);
          setTimeout(() => this.printer.print(), 300);
        }
      })
      .catch(err => {
        el.disabled = false;
        this.alerter.error(err);
      })
  }


  cancel() {
    let conf = confirm('你确定需要取消退料吗？');
    if (conf) {
      history.go(-1);
    }
  }
  suspend(event: Event) {
    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    let inner = this.employees.find(m => m.value == this.model.returnUser);
    let department = this.departments.find(m => m.value == this.model.returnDepart);
    this.model['innerReturner'] = inner && inner.text;
    this.model['department'] = department && department.text;
    this.suspendBill.suspend(this.model)
      .then(() => el.disabled = false)
      .then(() => this.suspendBill.refresh())
      .then(() => this.alerter.success('挂单成功！'))
      .catch(err => {
        el.disabled = false;
        this.alerter.error(err);
      })
  }

  onCreate(event: InnerListItem) {
    // console.log(this.model.list);
    this.model.list.push(event);
    this.createModal.hide();
  }

  private loadDepartments(id: string) {
    this.departments = [];
    this.innerReturnService.getDepartmentsByInner(id)
      .then(options => this.departments = options)
      .then(options => this.reset())
      .catch(err => this.alerter.error(err));
  }

  onSuspendSelect(item: { id: string, value: any }) {
    this.reset();
    Object.assign(this.model, item.value);
    this.model.suspendedBillId = item.id;
  }
  reset() {
    this.model = new InnerListRequest();
    if (Array.isArray(this.employees) && this.employees.length) {
      this.model.returnUser = this.employees[0].value;
    }
    if (Array.isArray(this.departments) && this.departments.length) {
      this.model.returnDepart = this.departments[0].value;
    }
  }
  get innerColumns() {
    return [
      { name: 'innerReturner', title: '退料人' },
      { name: 'department', title: '部门' },
    ]
  }

}
