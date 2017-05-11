import { Injectable } from '@angular/core';
import { PagedResult, PagedParams, ApiResult } from 'app/shared/models';
import { Urls, HttpService } from 'app/shared/services';

@Injectable()
export class PurchaseReturnService {

  constructor(private httpService: HttpService) { }

  public getProducts(request: GetProductsRequest): Promise<PagedResult<any>> {
    let url = Urls.chain.concat('/PurchaseDetails/GetPageList');
    let search = request.serialize();
    return this.httpService.get<PagedResult<any>>(url, search)
      .catch(err => Promise.reject(`获取配件信息失败：${err}`));
  }

  public generate(request: PurchaseReturnRequest): Promise<string> {
    let url = Urls.chain.concat('/StoreInOutDetails/CreatePurchaseReturnBill');
    return this.httpService.post<ApiResult<string>>(url, request)
      .then(result => result.data)
      .catch(err => Promise.reject(`生成退库单失败：${err}`));
  }
}

export class GetProductsRequest extends PagedParams {
  constructor(
    public productCode?: string,
    public productName?: string,
  ) {
    super();
  }
}

export class PurchaseReturnRequest {
  constructor(
    public list: Array<PurchaseReturnItem> = [],
    public provider?: string,
    public providerId?: string,
    public suspendedBillId?: string,
  ) { }
}

export class PurchaseReturnItem {
  constructor(
    public count: number = 0,
    public price: number = 0,
    public amount: number = 0,
    public taxRate: number = 0,
    public exTaxPrice: number = 0,
    public exTaxAmount: number = 0,
    public productName?: string,
    public brand?: string,
    public productId?: string,
    public productCode?: string,
    public productCategory?: string,
    public storeId?: string,
    public locationId?: string,
    public description?: string,
    public locationName?: string,
    public houseName?: string,
    public specification?: string,
    public vehicleName?: string,
    public packingCode?: string,
  ) { }
}

export class PurchaseReturnPrintItem {

}