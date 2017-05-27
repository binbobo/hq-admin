import { Injectable } from '@angular/core';
import { HttpService, Urls } from "app/shared/services";
import { SelectOption, ListResult, PagedParams, BasicService, PagedResult, ApiResult } from "app/shared/models";

@Injectable()
export class InnerReturnService implements BasicService<any>{

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
  constructor(private httpService: HttpService) { }

  //获取内部领用单号信息
  getCodePagedList(params: BillCodeSearchRequest): Promise<PagedResult<any>> {
    const url = Urls.chain.concat('/Uses/SearchBillCode?', params.serialize());
    return this.httpService.get<PagedResult<any>>(url)
      .then(result => {
        return result;
      })
      .catch(err => Promise.reject(`获取内部领用数据失败：${err}`));
  }
  //获取配件信息
  getPagedList(params: BillCodeSearchRequest): Promise<PagedResult<any>> {
    const url = Urls.chain.concat('/UseDetails/Search?', params.serialize());
    return this.httpService.get<PagedResult<any>>(url)
      .then(result => {
        return result;
      })
      .catch(err => Promise.reject(`获取配件信息数据失败：${err}`));
  }
  //打印
  get(code: string): Promise<InnerPrintItem> {
    if (!code) return Promise.resolve({});
    let url = Urls.chain.concat('/UseReturnDetails/Print?BillCode=', code);
    return this.httpService.get<ApiResult<any>>(url)
      .then(result => {
        return result.data;
      })
      .catch(err => Promise.reject(`获取内部退料单信息失败：${err}`));
  }
  //生成退料单
  createReturnList(data: any): Promise<any> {
    let url = Urls.chain.concat('/StoreInOutDetails/CreateUseReturnBill');
    return this.httpService.post<ApiResult<any>>(url, data)
      .then(result => result.data)
      .catch(err => Promise.reject(`生成退料清单失败：${err}`))
  }
  //获取退料人
  getInnerOptions(): Promise<any> {
    let url = Urls.chain.concat('/Uses/GetPagedList');
    return this.httpService.get<ApiResult<any>>(url)
      .then(result => {
        return result.data
      })
      .catch(err => Promise.reject(`获取退料人选项失败：${err}`));
  }

}

export class InnerPrintItem {
  public title?: string;
  public billCode?: string;
  public createBillDateTime?: string;
  public takeUser?: string;
  public department?: string;
  public totalAmount: string;
  public printDateTime: string;
  public operator: string;
  public list: Array<any>
}
export class InnerListRequest {
  constructor(
    public list: Array<InnerListItem> = [],
    public returnUser?: string,
    public returnDepart?: string,
    public suspendedBillId?: string,
  ) {
  }
}
//配件信息参数
export class InnerListItem {
  constructor(
    public count: number,
    public returnCount: number,
    public price: number,
    public amount: number,
    // public productCategory?: string,
    public productName?: string,
    public brandName?: string,
    public takeUser?: string,
    public productCode?: string,
    public specification?: string,
    public operator?: string,
    public createBillTime?: string,
    public locationName?: string,
    public storeName?: string
  ) {
  }
}
//领用单号模糊查询参数
export class BillCodeSearchRequest extends PagedParams {
  constructor(
    public takeUserId?: string, // 领用人ID
    public takeDepartId?: string, // 部门ID
    public billCode?: string, // 领用单号
  ) {
    super();
  }
}