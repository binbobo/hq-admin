import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { ListResult, SelectOption, ApiResult } from 'app/shared/models';

@Injectable()
export class SalesService {

  constructor(private httpService: HttpService) { }

  generate(data: SalesListRequest): Promise<string> {
    let url = Urls.chain.concat('/StoreInOutDetails/CreateSaleBill');
    return this.httpService.post<ApiResult<string>>(url, data)
      .then(result => result.data)
      .catch(err => Promise.reject(`生成销售清单失败：${err}`))
  }

  get(code: string): Promise<SalesPrintItem> {
    if (!code) return Promise.resolve({});
    let url = Urls.chain.concat('/SaleDetails/Print?BillCode=', code);
    return this.httpService.get<ApiResult<SalesPrintItem>>(url)
      .then(result => result.data)
      .catch(err => Promise.reject(`获取销售出售单信息失败：${err}`));
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

export class SalesPrintItem {
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

export class SalesListRequest {
  constructor(
    public list: Array<SalesListItem> = [],
    public custName?: string,
    public custPhone?: string,
    public seller?: string,
    public suspendedBillId?: string,
  ) { }
}

export class SalesListItem {
  constructor(
    public count: number = 1,
    public price: number = 0,
    public amount: number = 0,
    public stockCount: number = 0,
    public productName?: string,
    public productUnit?: string,
    public brand?: string,
    public productId?: string,
    public productCode?: string,
    public productSpecification?: string,
    public description?: string,
    public locationName?: string,
    public locationId?: string,
    public storeId?: string,
    public productCategory?: string,
    public categoryId?: string,
    public houseName?: string
  ) { }
}