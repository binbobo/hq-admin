import { Injectable } from '@angular/core';
import { PagedResult, PagedParams, ApiResult } from 'app/shared/models';
import { Urls, HttpService } from 'app/shared/services';

@Injectable()
export class ProcurementService {

  constructor(private httpService: HttpService) { }

  public get(code: string): Promise<ProcurementPrintItem> {
    if (!code) return Promise.resolve({});
    let url = Urls.chain.concat('/PurchaseDetails/Print?BillCode=', code);
    return this.httpService.getObject<ProcurementPrintItem>(url)
      .then(data => data || Promise.reject('服务端返回数据无效！'))
      .catch(err => Promise.reject(`获取采购入库单信息失败：${err}`));
  }

  public generate(request: ProcurementRequest) {
    let url = Urls.chain.concat('/StoreInOutDetails/CreatePurchaseBill');
    return this.httpService.post<ApiResult<string>>(url, request)
      .then(result => result.data)
      .then(id => id || Promise.reject<string>('服务端返回数据错误！'))
      .catch(err => Promise.reject(`生成采购入库单失败：${err}`));
  }
}

export class ProcurementRequest {
  constructor(
    public list: Array<ProcurementItem> = [],
    public custName?: string,
    public outunit?: string,
    public suspendedBillId?: string,
  ) { }

  get valid() {
    return this.outunit && this.list && this.list.length;
  }
}

export class ProcurementItem {
  constructor(
    public count: number = 1,
    public price: number = 0,
    public amount: number = 0,
    public taxRate: number = 17,
    public exTaxPrice: number = 0,
    public exTaxAmount: number = 0,
    public productUnit?: string,
    public brandName?: string,
    public productId?: string,
    public productName?: string,
    public productCode?: string,
    public productCategory?: string,
    public productSpecification?: string,
    public storeId?: string,
    public locationId?: string,
    public locationName?: string,
    public houseName?: string,
  ) { }
}

export class ProcurementPrintItem {

}