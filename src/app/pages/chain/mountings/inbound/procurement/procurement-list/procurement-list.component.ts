import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderService, ProviderListRequest } from '../../../provider/provider.service';
import { TypeaheadRequestParams, HqAlerter, PrintDirective } from 'app/shared/directives';
import { Location } from '@angular/common';
import { SuspendBillDirective } from 'app/pages/chain/chain-shared';
import { ModalDirective } from 'ngx-bootstrap';
import { ProcurementService, ProcurementPrintItem, ProcurementItem, ProcurementRequest } from '../procurement.service';

@Component({
  selector: 'hq-procurement-list',
  templateUrl: './procurement-list.component.html',
  styleUrls: ['./procurement-list.component.css']
})
export class ProcurementListComponent implements OnInit {

  @ViewChild(SuspendBillDirective)
  private suspendBill: SuspendBillDirective;
  @ViewChild('createModal')
  private createModal: ModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild('printer')
  public printer: PrintDirective;
  private printModel: ProcurementPrintItem;
  private model = new ProcurementRequest();

  constructor(
    private providerService: ProviderService,
    private procurementService: ProcurementService,
    private location: Location
  ) { }

  ngOnInit() {
  }

  onSuspendSelect(item: { id: string, value: any }) {
    Object.assign(this.model, item.value);
    this.model.suspendedBillId = item.id;
  }

  onCreate(event: ProcurementItem) {
    this.model.list.push(event);
    this.createModal.hide();
  }

  reset() {
    this.model = new ProcurementRequest();
  }

  public get suspendedColumns() {
    return [
      { name: 'custName', title: '供应商' },
      { name: 'createBillTime', title: '挂单时间' },
    ];
  }

  private get providerColumns() {
    return [
      { name: 'code', title: '代码' },
      { name: 'name', title: '名称', weight: 1 },
      { name: 'contactUser', title: '联系人' },
    ];
  }

  public onProviderSelect(event) {
    this.model.custName = event.name;
    this.model.outunit = event.id;
  }

  public get source() {
    return (params: TypeaheadRequestParams) => {
      let p = new ProviderListRequest(params.text, params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.providerService.getPagedList(p);
    };
  }

  suspend(event: Event) {
    if (!this.model.outunit) {
      alert('请选择供应商名称');
      return false;
    }
    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    this.suspendBill.suspend(this.model)
      .then(() => el.disabled = false)
      .then(() => this.suspendBill.refresh())
      .then(() => this.alerter.success('挂单成功！'))
      .catch(err => {
        el.disabled = false;
        this.alerter.error(err);
      })
  }

  generate(event: Event) {
    if (!this.model.outunit) {
      alert('请选择供应商名称');
      return false;
    }
    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    this.procurementService.generate(this.model)
      .then(data => {
        el.disabled = false;
        this.reset();
        this.suspendBill.refresh();
        return confirm('已生成出库单，是否需要打印？') ? data : null;
      })
      .then(code => code && this.procurementService.get(code))
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

  private cancel() {
    this.location.back();
  }
}
