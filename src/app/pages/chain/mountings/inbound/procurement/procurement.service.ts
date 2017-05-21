import { Injectable } from '@angular/core';
import { PagedResult, PagedParams, ApiResult } from 'app/shared/models';
import { Urls, HttpService } from 'app/shared/services';

@Injectable()
export class ProcurementService {

  constructor(private httpService: HttpService) { }

  public getProducts(request: GetProductsRequest): Promise<PagedResult<any>> {
    let url = Urls.chain.concat('/Products/GetListByNameOrCode');
    let search = request.serialize();
    return this.httpService.get<PagedResult<any>>(url, search)
      .catch(err => Promise.reject(`获取配件信息失败：${err}`));
  }

  public get(code: string): Promise<ProcurementPrintItem> {
    if (!code) return Promise.resolve({});
    let url = Urls.chain.concat('/PurchaseDetails/Print?BillCode=', code);
    return this.httpService.get<ApiResult<ProcurementPrintItem>>(url)
      .then(result => result.data)
      .catch(err => Promise.reject(`获取采购单信息失败：${err}`));
  }

  public generate(request: ProcurementRequest): Promise<string> {
    let url = Urls.chain.concat('/StoreInOutDetails/CreatePurchaseBill');
    return this.httpService.post<ApiResult<string>>(url, request)
      .then(result => result.data)
      .catch(err => Promise.reject(`生成采购单失败：${err}`));
  }
}

export class GetProductsRequest extends PagedParams {
  constructor(
    public code?: string,
    public name?: string,
  ) {
    super();
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
    public brand?: string,
    public productId?: string,
    public productName?: string,
    public productCode?: string,
    public productCategory?: string,
    public productSpecification?: string,
    public storeId?: string,
    public locationId?: string,
    public packingCode?: string,
    public description?: string,

    public locationName?: string,
    public houseName?: string,
    public vehicleName?: string,
  ) { }
}

export class ProcurementPrintItem {

}