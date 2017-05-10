import { Injectable } from '@angular/core';
import { HttpService, Urls } from "app/shared/services";
import { SelectOption, ListResult, PagedParams, BasicService, PagedResult } from "app/shared/models";
import { GetMountingsListRequest } from "app/pages/chain/mountings/mountings.service";
import { GenerateSuspendedBillRequest } from "app/pages/chain/mountings/suspended-bills.service";

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
  getPagedList(params: PagedParams): Promise<PagedResult<any>> {
    throw new Error('Method not implemented.');
  }
  get(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }


  constructor(private httpService: HttpService) { }
  //生成退料单
  createReturnList(data: InnerListRequest): Promise<void> {
    let url = Urls.chain.concat('/StoreInOutDetails/CreateUseReturnBill');
    return this.httpService.post<void>(url, data)
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
  //根据配件名称或编码模糊查询
  public getListByCodeOrName(params: GetMountingsListRequest): Promise<PagedResult<any>> {
    let url = Urls.chain.concat('/Products/GetPageListByNameOrCode');
    let search = params.serialize();
    return this.httpService.get<PagedResult<any>>(url, search)
      .then(result => {
        if (result.data && Array.isArray(result.data)) {
          result.data.forEach(m => {
            m.price = m.price || 0;
            m.price = (m.price / 100).toFixed(2);
          });
        }
        return result;
      })
      .catch(err => Promise.reject(`获取配件信息失败：${err}`));
  }

}


export class InnerListRequest extends GenerateSuspendedBillRequest {
  constructor(
    public inUnit?: string,
    // public returnUser?: string,
    // public returnDepart?: string,
    public seller?: string,
    public list?: Array<InnerListItem>,
  ) {
    super();
  }
}
export class InnerListItem {
  constructor(
    public returnUser?: string,
    public returnDepart?: string,
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
    public houseName?: string
  ) { }
}
