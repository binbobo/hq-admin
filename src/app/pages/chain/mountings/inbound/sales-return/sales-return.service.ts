import { Injectable } from '@angular/core';
import { HttpService, Urls } from "app/shared/services";
import { ApiResult, SelectOption, ListResult, BasicService, PagedParams, PagedResult } from "app/shared/models";

@Injectable()
export class SalesReturnService implements BasicService<any>{
   

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

//   //客户信息模糊查询
  getCustomerPagedList(params: CustomerRequest): Promise<PagedResult<any>> {
    const url = Urls.chain.concat('/Sales/GetCustomer?', params.serialize());
    return this.httpService.get<PagedResult<any>>(url)
      .then(result => {
        console.log('客户信息',result);
        return result;
      })
      .catch(err => Promise.reject(`获取客户信息失败：${err}`));
  }
//   //退库单号模糊查询
  getBillCodePagedList(params: BillCodeRequest): Promise<PagedResult<any>> {
    const url = Urls.chain.concat('/Sales/SearchBillCode?', params.serialize());
    console.log('单号获取',url);
    return this.httpService.get<PagedResult<any>>(url)
      .then(result => {
        return result;
      })
      .catch(err => Promise.reject(`获取退库单号信息失败：${err}`));
  }

//   //获取配件信息
  getPagedList(params: SaleDetailsRequest): Promise<PagedResult<any>> {
    const url = Urls.chain.concat('/SaleDetails/GetPagedList?', params.serialize());
    return this.httpService.get<PagedResult<any>>(url)
      .then(result => {
        return result;
      })
      .catch(err => Promise.reject(`获取配件信息数据失败：${err}`));
  }

  constructor(private httpService: HttpService) { }
//生成退库单
  createReturnList(data: any): Promise<any> {
    let url = Urls.chain.concat('/StoreInOutDetails/CreateSaleReturnBill');
    return this.httpService.post<ApiResult<any>>(url, data)
      .then(result => result.data)
      .catch(err => Promise.reject(`生成销售退库单失败：${err}`))
  }
//打印
  get(code: string): Promise<SalesReturnPrintItem> {
    if (!code) return Promise.resolve({});
    let url = Urls.chain.concat('/SaleReturnDetails/Print?BillCode=', code);
    return this.httpService.get<ApiResult<SalesReturnPrintItem>>(url)
      .then(result => result.data)
      .catch(err => Promise.reject(`获取销售退库单信息失败：${err}`));
  }


}


export class CustomerRequest extends PagedParams {
  constructor(
    public customerName?: string,//客户名称
  ) {
    super();
  }
}

export class BillCodeRequest extends PagedParams {
  constructor(
    public customerId?: string, // 客户ID
    public customerName?: string, // 客户I
    // public phone?: string, // 客户I
    public billCode?: string, // 单号
  ) {
    super();
  }
}

export class SaleDetailsRequest extends PagedParams {
  constructor(
    public customerId?: string, // 客户ID
    public customerName?: string, // 客户I
    public billCode?: string, // 单号
    public billId?: string, // 标识
    // public keyName?: string, // 标识
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

export class SalesReturnListItem extends PagedParams{
  constructor(
    public count: number = 0,
    public price: number = 0,
    public amount: number = 0,
    // public stockCount: number = 0,
    public productName?: string,
    public brandName?: string,
    public operator?: string,
    public productCode?: string,
    public specification?: string,
    public storeId?: string,
    public locationId?: string,
    public returnCount?: string,
    public locationName?: string,
    public storeName?: string
  ) {
    super()
   }
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