import { Injectable } from '@angular/core';
import { PagedResult, PagedParams, ApiResult, PagedService } from 'app/shared/models';
import { Urls, HttpService } from 'app/shared/services';

@Injectable()
export class PurchaseReturnService implements PagedService<any> {

  constructor(private httpService: HttpService) { }

  public getPagedList(request: GetProductsRequest): Promise<PagedResult<any>> {
    let url = Urls.chain.concat('/PurchaseDetails/GetPageList');
    return this.httpService.getPagedList(url, request)
      .catch(err => Promise.reject(`获取配件信息失败：${err}`));
  }

  getBillCodeListByProvider(request: GetBillCodeRequest) {
    let url = Urls.chain.concat('/Purchases/GetPageList');
    return this.httpService.getPagedList<any>(url, request)
      .catch(err => Promise.reject(`获取入库单号失败：${err}`));
  }

  get(code: string): Promise<PurchaseReturnPrintItem> {
    if (!code) return Promise.resolve({});
    let url = Urls.chain.concat('/PurchaseReturnDetails/Print?BillCode=', code);
    return this.httpService.get<ApiResult<PurchaseReturnPrintItem>>(url)
      .then(result => result.data)
      .catch(err => Promise.reject(`获取退库单信息失败：${err}`));
  }

  public generate(request: PurchaseReturnRequest): Promise<string> {
    let url = Urls.chain.concat('/StoreInOutDetails/CreatePurchaseReturnBill');
    return this.httpService.post<ApiResult<string>>(url, request)
      .then(result => result.data)
      .catch(err => Promise.reject(`生成退库单失败：${err}`));
  }
}

export class GetBillCodeRequest extends PagedParams {
  constructor(
    public supplierId: string
  ) {
    super();
  }
}

export class GetProductsRequest extends PagedParams {
  constructor(
    public suppliers?: string,
    public billCode?: string,
  ) {
    super();
  }
}

export class PurchaseReturnRequest {
  constructor(
    public list: Array<PurchaseReturnItem> = [],
    public provider?: string,
    public inunit?: string,
    public originalBillId?: string,
    public suspendedBillId?: string,
    public billCode?: string
  ) { }

  get valid() {
    return this.inunit && this.originalBillId && this.list && this.list.length;
  }
}

export class PurchaseReturnItem {
  constructor(
    public count: number = 0,
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
    public specification?: string,
    public storeId?: string,
    public locationId?: string,
    public packingCode?: string,
    public description?: string,
    public originalId?: string,
    public locationName?: string,
    public storeName?: string,
    public vehicleName?: string,
  ) { }
}

export class PurchaseReturnPrintItem {
  constructor(
    public list: Array<any> = [],
    public title?: string,
    public billCode?: string,
    public createBillDateTime?: string,
    public totalAmount?: string,
    public totalExTaxAmount?: string,
    public printDateTime?: string,
    public operator?: string,
  ) { }
}