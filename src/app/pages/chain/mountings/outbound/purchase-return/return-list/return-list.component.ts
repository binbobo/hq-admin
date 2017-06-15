import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { ProviderService, ProviderListRequest } from '../../../provider/provider.service';
import { TypeaheadRequestParams, HqAlerter, PrintDirective, HqModalDirective } from 'app/shared/directives';
import { PurchaseReturnPrintItem, PurchaseReturnItem, PurchaseReturnService, GetBillCodeRequest, GetProductsRequest, PurchaseReturnRequest } from '../purchase-return.service';
import { SelectOption, DataList } from 'app/shared/models';
import { PurchaseOutBillDirective } from '../purchase-out-bill.directive';
import { SweetAlertService } from "app/shared/services";

@Component({
  selector: 'hq-return-list',
  templateUrl: './return-list.component.html',
  styleUrls: ['./return-list.component.css']
})
export class ReturnListComponent extends DataList<PurchaseReturnItem> implements OnInit {

  @ViewChild(PurchaseOutBillDirective)
  private suspendBill: PurchaseOutBillDirective;
  @ViewChild('createModal')
  private createModal: HqModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild('printer')
  public printer: PrintDirective;
  params: GetProductsRequest;
  private billCodes: Array<SelectOption>;
  private printModel: PurchaseReturnPrintItem;
  private model = new PurchaseReturnRequest();
  private product: PurchaseReturnItem;
  private totalValue: any;

  constructor(
    injector: Injector,
    private providerService: ProviderService,
    private returnService: PurchaseReturnService,
    private sweetAlertService: SweetAlertService,
  ) {
    super(injector, returnService);
    this.reset();
  }

  ngOnInit() {
    this.params.pageSize = 5;
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

  onCreated(event: any) {
    let item = event.data;
    let exists = this.model.list.find(m => m.productId === item.productId);
    if (exists) {
      Object.assign(exists, item);
    } else {
      this.model.list.push(item);
    }
    this.aggregate();
    if (!event.continuable) {
      this.createModal.hide();
    }
  }

  private aggregate() {
    if (!this.model || !this.model.list) return;
    this.totalValue = { count: 0, price: 0, exTaxPrice: 0, amount: 0, exTaxAmount: 0 };
    this.model.list.forEach(m => {
      this.totalValue.count += +m.count;
      this.totalValue.price += +m.price;
      this.totalValue.exTaxPrice += +m.exTaxPrice;
      this.totalValue.amount += +m.amount;
      this.totalValue.exTaxAmount += +m.exTaxAmount;
    })
  }

  private reset() {
    this.billCodes = [];
    this.list = [];
    this.params = new GetProductsRequest();
    this.model = new PurchaseReturnRequest();
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
        this.sweetAlertService.confirm({ text: '已生成采购退库单，是否需要打印？' })
          .then(() => {
            data && this.returnService.get(data)
              .then(data => {
                if (data) {
                  this.printModel = data;
                  setTimeout(() => this.printer.print(), 300);
                }
              })
              .then(() => {
                el.disabled = false;
                this.reset();
                this.suspendBill.refresh();
              })
          }, () => {
            el.disabled = false;
            this.reset();
            this.suspendBill.refresh();
          })
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
    this.sweetAlertService.confirm({ text: '是否确认删除该条退库信息？', type: 'warning' })
      .then(() => {
        let index = this.model.list.indexOf(item);
        this.model.list.splice(index, 1);
        this.aggregate();
      }, () => { })
  }

  getAddedCount(item: PurchaseReturnItem): number {
    if (!item) return 0;
    return this.model.list
      .filter(m => m.productId === item.productId)
      .map(m => +m.count)
      .reduce((pre, cur) => pre + cur, 0);
  }
}
