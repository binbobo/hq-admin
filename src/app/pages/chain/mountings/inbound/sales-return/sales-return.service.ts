import { Injectable } from '@angular/core';
import { HttpService, Urls } from "app/shared/services";
import { ApiResult, SelectOption, ListResult, BasicService, PagedParams, PagedResult } from "app/shared/models";

@Injectable()
export class SalesReturnService implements BasicService<any>{
  getPagedList(params: PagedParams): Promise<PagedResult<any>> {
    throw new Error('Method not implemented.');
  }

  create(body: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  update(body: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  patch(body: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  //客户信息模糊查询
  getCustomerPagedList(params: CustomerRequest): Promise<PagedResult<any>> {
    const url = Urls.chain.concat('/Sales/GetPagedList?', params.serialize());
    console.log("客户信息url",url);
    return this.httpService.get<PagedResult<any>>(url)
      .then(result => {
        console.log('客户信息数据', result);
        return result;
      })
      .catch(err => Promise.reject(`获取客户信息失败：${err}`));
  }
  //退库单号模糊查询
  getBillCodePagedList(params: BillCodeRequest): Promise<PagedResult<any>> {
    const url = Urls.chain.concat('/Sales/GetPagedList?', params.serialize());
    console.log("退库单url",url);
    return this.httpService.get<PagedResult<any>>(url)
      .then(result => {
        console.log('退库单号数据', result);
        return result;
      })
      .catch(err => Promise.reject(`获取退库单号信息失败：${err}`));
  }

  //获取配件信息
  getSaleDetailsList(params: BillCodeRequest): Promise<PagedResult<any>> {
    const url = Urls.chain.concat('/SaleDetails/GetPageList?', params.serialize());
    console.log("配件信息url",url);
    return this.httpService.get<PagedResult<any>>(url)
      .then(result => {
        console.log('配件信息数据', result);
        return result;
      })
      .catch(err => Promise.reject(`获取配件信息数据失败：${err}`));
  }

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

  // getSalesmanOptions(): Promise<Array<SelectOption>> {
  //   let url = Urls.chain.concat('/Employees/GetByKey?key=Seller');
  //   return this.httpService.get<ListResult<any>>(url)
  //     .then(result => result.data)
  //     .then(data => Array.isArray(data) ? data : [])
  //     .then(data => data.map(m => new SelectOption(m.name, m.id)))
  //     .catch(err => Promise.reject(`获取销售员选项失败：${err}`));
  // }

}


export class CustomerRequest extends PagedParams {
  constructor(
    public customerName?: string,//客户名称
    public phone?: string,//电话
    // public pageIndex = 1,
    // public pageSize = 5,
  ) {
    super();
  }
}

export class BillCodeRequest extends PagedParams {
  constructor(
    public customerId?: string, // 客户ID
    public customerName?: string, // 客户名称
    public billCode?: string, // 退库单号
    // public pageIndex = 1,
    // public pageSize = 5,
  ) {
    super();
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