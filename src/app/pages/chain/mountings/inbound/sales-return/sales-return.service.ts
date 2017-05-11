import { Injectable } from '@angular/core';
import { HttpService, Urls } from "app/shared/services";
import { ApiResult, SelectOption, ListResult } from "app/shared/models";

@Injectable()
export class SalesReturnService {

  constructor(private httpService: HttpService) { }

  createReturnList(data: SalesReturnListRequest): Promise<string> {
    let url = Urls.chain.concat('/StoreInOutDetails/CreateSaleReturnBill');
    return this.httpService.post<ApiResult<string>>(url, data)
      .then(result => result.data)
      .catch(err => Promise.reject(`生成销售退库单失败：${err}`))
  }

  get(code: string): Promise<SalesReturnPrintItem> {
    if (!code) return Promise.resolve({});
    let url = Urls.chain.concat('/SaleReturnDetails/Print?BillCode=', code);
    return this.httpService.get<ApiResult<SalesReturnPrintItem>>(url)
      .then(result => result.data)
      .catch(err => Promise.reject(`获取销售退库单信息失败：${err}`));
  }

  getSalesmanOptions(): Promise<Array<SelectOption>> {
    let url = Urls.chain.concat('/Employees/GetByKey?key=Seller');
    return this.httpService.get<ListResult<any>>(url)
      .then(result => result.data)
      .then(data => Array.isArray(data) ? data : [])
      .then(data => data.map(m => new SelectOption(m.name, m.id)))
      .catch(err => Promise.reject(`获取销售员选项失败：${err}`));
  }

}

export class SalesReturnListRequest {
  constructor(
    public list: Array<SalesReturnListItem> = [],
    public custName?: string,
    public custPhone?: string,
    public seller?: string,
    public createBillDateTime?: string,
    public suspendedBillId?: string,
  ) { }
}

export class SalesReturnListItem {
  constructor(
    public count: number = 0,
    public price: number = 0,
    public amount: number = 0,
    public stockCount: number = 0,
    public productName?: string,
    public brand?: string,
    public productId?: string,
    public productCode?: string,
    public productSpecification?: string,
    public storeId?: string,
    public locationId?: string,
    public description?: string,
    public locationName?: string,
    public houseName?: string
  ) { }
}

export class SalesReturnPrintItem {
  public title?: string;
  public billCode?: string;
  public customerName?: string;
  public seller?: string;
  public createBillDateTime?: string;
  public totalAmount: string;
  public printDateTime: string;
  public operator: string;
  public list: Array<any>
}