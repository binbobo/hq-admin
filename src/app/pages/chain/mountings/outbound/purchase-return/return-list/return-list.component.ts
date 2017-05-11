import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderService, ProviderListRequest } from '../../../provider/provider.service';
import { TypeaheadRequestParams, HqAlerter, PrintDirective } from 'app/shared/directives';
import { PurchaseReturnRequest } from "app/pages/chain/mountings/outbound/purchase-return/purchase-return.service";
import { Location } from '@angular/common';
import { SuspendBillDirective } from 'app/pages/chain/chain-shared';
import { ModalDirective } from 'ngx-bootstrap';
import { PurchaseReturnPrintItem, PurchaseReturnItem } from '../purchase-return.service';

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
  private printModel: PurchaseReturnPrintItem;
  private model = new PurchaseReturnRequest();

  constructor(
    private providerService: ProviderService,
    private location: Location
  ) { }

  ngOnInit() {
  }

  onSuspendSelect(item: { id: string, value: any }) {
    Object.assign(this.model, item.value);
    this.model.suspendedBillId = item.id;
  }

  onCreate(event: PurchaseReturnItem) {
    this.model.list.push(event);
    this.createModal.hide();
  }

  reset() {
    this.model = new PurchaseReturnRequest();
  }

  public get columns() {
    return [
      { name: 'provider', title: '供应商' },
      { name: 'operator', title: '操作人' },
    ];
  }

  public onProviderSelect(event) {
    this.model.provider = event.name;
    this.model.providerId = event.code;
  }

  public get source() {
    return (params: TypeaheadRequestParams) => {
      let p = new ProviderListRequest(params.text, params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.providerService.getPagedList(p);
    };
  }

  suspend(event: Event) {
    if (!this.model.provider) {
      alert('请输入供应商名称');
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

  private cancel() {
    this.location.back();
  }
}
