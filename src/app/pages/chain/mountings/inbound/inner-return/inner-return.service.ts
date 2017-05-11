import { Injectable } from '@angular/core';
import { HttpService, Urls } from "app/shared/services";
import { SelectOption, ListResult, PagedParams, BasicService, PagedResult, ApiResult } from "app/shared/models";

@Injectable()
export class InnerReturnService {

  constructor(private httpService: HttpService) { }

  get(code: string): Promise<InnerPrintItem> {
    if (!code) return Promise.resolve({});
    let url = Urls.chain.concat('/UseReturnDetails/Print?BillCode=', code);
    return this.httpService.get<ApiResult<any>>(url)
      .then(result => {
        // console.log(result.data);
        return result.data;})
      .catch(err => Promise.reject(`获取内部退料单信息失败：${err}`));
  }
  //生成退料单
  createReturnList(data: InnerListRequest): Promise<string> {
    let url = Urls.chain.concat('/StoreInOutDetails/CreateUseReturnBill');
    return this.httpService.post<ApiResult<string>>(url, data)
      .then(result => result.data)
      .catch(err => Promise.reject(`生成退料清单失败：${err}`))
  }
  //获取退料人
  getInnerOptions(): Promise<Array<SelectOption>> {
    let url = Urls.chain.concat('/Employees/GetByKey?key=ST');
    return this.httpService.get<ListResult<any>>(url)
      .then(result => result.data)
      .then(data => Array.isArray(data) ? data : [])
      .then(data => data.map(m => new SelectOption(m.name, m.id)))
      .catch(err => Promise.reject(`获取退料人选项失败：${err}`));
  }
  //获取部门
  getDepartmentsByInner(id: string): Promise<Array<SelectOption>> {
    let url = Urls.chain.concat('/Departments/GetDataByEmployee/', id);
    return this.httpService.get<ListResult<any>>(url)
      .then(result => result.data)
      .then(data => Array.isArray(data) ? data : [])
      .then(data => data.map(m => new SelectOption(m.name, m.id)))
      .catch(err => Promise.reject(`获取部门选项失败：${err}`))
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
export class InnerListItem {
  constructor(
    public count: number = 0,
    public price: number = 0,
    public amount: number = 0,
    public productCategory?: string,
    public productName?: string,
    public brand?: string,
    public productId?: string,
    public productCode?: string,
    public productSpecification?: string,
    public storeId?: string,
    public locationId?: string,
    public description?: string,
    public locationName?: string,
    public houseName?: string,
    public storeName?:string
  ) { }
}
