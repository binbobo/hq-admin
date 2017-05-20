import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { ProviderService, ProviderListRequest } from '../../../provider/provider.service';
import { TypeaheadRequestParams, HqAlerter, PrintDirective } from 'app/shared/directives';
import { SuspendBillDirective } from 'app/pages/chain/chain-shared';
import { ModalDirective } from 'ngx-bootstrap';
import { PurchaseReturnPrintItem, PurchaseReturnItem, PurchaseReturnService, GetBillCodeRequest, GetProductsRequest, PurchaseReturnRequest } from '../purchase-return.service';
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
  private product: PurchaseReturnItem;

  constructor(
    injector: Injector,
    private providerService: ProviderService,
    private returnService: PurchaseReturnService,
  ) {
    super(injector, returnService);
    this.size = 5;
    this.reset();
  }

  ngOnInit() {
    this.lazyLoad = true;
    super.ngOnInit();
  }

  onSuspendSelect(item: { id: string, value: any }) {
    Object.assign(this.model, item.value);
    this.model.suspendedBillId = item.id;
    this.params.suppliers = item.value.inunit;
    this.params.billCode = item.value.billCode;
    this.loadList();
    this.loadBillCodeList()
      .then(() => this.billCodes.forEach(m => m.checked = this.model.originalBillId === m.value || undefined));
  }

  onCreate(item: PurchaseReturnItem) {
    if (this.product.count == 0) {
      this.alerter.warn('配件库存不足，无法完成退库操作！');
      return;
    }
    let exists = this.model.list.find(m => m.productId === item.productId);
    if (exists) {
      if (exists.count + item.count >= this.product.count) {
        exists.count = this.product.count;
      } else {
        exists.count = exists.count + item.count;
      }
    } else {
      item.count = item.count > this.product.count ? this.product.count : item.count;
      this.model.list.push(item);
    }
    this.createModal.hide();
  }

  private reset() {
    this.billCodes = [];
    this.list = [];
    this.params = new GetProductsRequest();
    this.model = new PurchaseReturnRequest();
  }

  private get suspendedColumns() {
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
    this.model.list = [];
    let el = event.target as HTMLSelectElement;
    this.model.originalBillId = el.value;
    if (el.value) {
      this.params.billCode = el.selectedOptions[0].innerHTML;
      this.model.billCode = el.selectedOptions[0].innerHTML;
      this.loadList();
    } else {
      this.model.billCode = undefined;
      this.params.billCode = undefined;
    }
  }

  public onProviderSelect(event) {
    this.model.list = [];
    this.list = [];
    this.model.provider = event.name;
    this.model.inunit = event.id;
    this.params.suppliers = event.id;
    this.loadBillCodeList();
  }

  private loadBillCodeList() {
    this.billCodes = null;
    let request = new GetBillCodeRequest(this.params.suppliers);
    return this.returnService.getBillCodeListByProvider(request)
      .then(result => result.data.map(m => new SelectOption(m.billCode, m.id)))
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
    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    this.suspendBill.suspend(this.model)
      .then(() => el.disabled = false)
      .then(() => this.reset())
      .then(() => this.suspendBill.refresh())
      .then(() => this.alerter.success('挂单成功！'))
      .catch(err => {
        el.disabled = false;
        this.alerter.error(err);
      })
  }

  generate(event: Event) {
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

  onProductSelect(item) {
    this.product = item;
    this.createModal.show();
  }

  onProductRemove(item: PurchaseReturnItem) {
    if (!confirm('确定要删除？')) return;
    let index = this.model.list.indexOf(item);
    this.model.list.splice(index, 1);
  }

  getAddedCount(item: PurchaseReturnItem): number {
    if (!item) return 0;
    return this.model.list
      .filter(m => m.productId === item.productId)
      .map(m => +m.count)
      .reduce((pre, cur) => pre + cur, 0);
  }
}
