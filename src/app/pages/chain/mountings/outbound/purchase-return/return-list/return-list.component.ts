import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { ProviderService, ProviderListRequest } from '../../../provider/provider.service';
import { TypeaheadRequestParams, HqAlerter, PrintDirective } from 'app/shared/directives';
import { PurchaseReturnRequest } from "app/pages/chain/mountings/outbound/purchase-return/purchase-return.service";
import { Location } from '@angular/common';
import { SuspendBillDirective } from 'app/pages/chain/chain-shared';
import { ModalDirective } from 'ngx-bootstrap';
import { PurchaseReturnPrintItem, PurchaseReturnItem, PurchaseReturnService, GetBillCodeRequest, GetProductsRequest } from '../purchase-return.service';
import { SelectOption, DataList } from 'app/shared/models';

@Component({
  selector: 'hq-return-list',
  templateUrl: './return-list.component.html',
  styleUrls: ['./return-list.component.css']
})
export class ReturnListComponent extends DataList<any> implements OnInit {

  @ViewChild(SuspendBillDirective)
  private suspendBill: SuspendBillDirective;
  @ViewChild('createModal')
  private createModal: ModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild('printer')
  public printer: PrintDirective;
  params: GetProductsRequest;
  private billCodes: Array<SelectOption>;
  private printModel: PurchaseReturnPrintItem;
  private model = new PurchaseReturnRequest();

  constructor(
    injector: Injector,
    private providerService: ProviderService,
    private returnService: PurchaseReturnService,
    private location: Location
  ) {
    super(injector, returnService);
    this.size = 5;
    this.params = new GetProductsRequest();
  }

  ngOnInit() {
    this.lazyLoad = true;
    super.ngOnInit();
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

  public get suspendedColumns() {
    return [
      { name: 'provider', title: '供应商' },
      { name: 'createBillTime', title: '挂单时间' },
    ];
  }

  private get providerColumns() {
    return [
      { name: 'code', title: '代码' },
      { name: 'name', title: '名称' },
      { name: 'contactUser', title: '联系人' },
    ];
  }

  private onBillCodeChange(event: Event) {
    let el = event.target as HTMLSelectElement;
    this.params.billCode = el.value;
    this.loadList();
  }

  public onProviderSelect(event) {
    this.model.provider = event.name;
    this.model.inunit = event.id;
    this.params.suppliers = event.id;
    let request = new GetBillCodeRequest(event.id);
    this.billCodes = null;
    this.returnService.getBillCodeListByProvider(request)
      .then(result => result.data.map(m => new SelectOption(m.billCode, m.billCode)))
      .then(data => this.billCodes = data)
      .catch(err => this.alerter.error(err));
  }

  onSuspendRemove(event) {
    if (event.id === this.model.suspendedBillId) {
      this.reset();
    }
  }


  public get source() {
    return (params: TypeaheadRequestParams) => {
      let p = new ProviderListRequest(params.text, params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.providerService.getPagedList(p);
    };
  }

  suspend(event: Event) {
    if (!this.model.inunit) {
      alert('请选择供应商名称');
      return false;
    }
    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    this.suspendBill.suspend(this.model)
      .then(() => el.disabled = false)
      .then(() => el.disabled = false)
      .then(() => this.suspendBill.refresh())
      .then(() => this.alerter.success('挂单成功！'))
      .catch(err => {
        el.disabled = false;
        this.alerter.error(err);
      })
  }

  generate(event: Event) {
    if (!this.model.inunit) {
      alert('请选择供应商名称');
      return false;
    }
    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    this.returnService.generate(this.model)
      .then(data => {
        el.disabled = false;
        this.reset();
        this.suspendBill.refresh();
        return confirm('已生成出库单，是否需要打印？') ? data : null;
      })
      .then(code => code && this.returnService.get(code))
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
