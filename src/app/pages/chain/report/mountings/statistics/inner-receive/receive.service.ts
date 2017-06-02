import { Injectable } from '@angular/core';
import { BasicService, PagedParams, PagedResult, ApiResult, SelectOption, ListResult } from "app/shared/models";
import { HttpService, Urls } from "app/shared/services";

@Injectable()
export class ReceiveService implements BasicService<any>{
  create(body: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  update(body: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
  patch(body: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  //页面加载时分页获取信息
  public getPagedList(params: ReceiveRequest): Promise<PagedResult<any>> {
    const url = Urls.chain.concat('/Uses/Statistic?', params.serialize());
    console.log("url", url);
    return this.httpService.get<PagedResult<any>>(url)
      .then(result => {
        console.log('内部领用数据', result);
        return result;
      })
      .catch(err => Promise.reject(`内部领用数据失败：${err}`));
  }

  //导出
  public export(params: ReceiveRequest): Promise<void> {
    const url = Urls.chain.concat('/Uses/StatExportToExcel');
    return this.httpService
      .download(url, params.serialize())
      .catch(err => Promise.reject(`内部领用导出失败：${err}`));
  }

  //详情
  public get(id: string): Promise<any> {
    const url = Urls.chain.concat('/UseDetails/Statistic?BillId=', id);
    return this.httpService
      .get<ApiResult<any>>(url)
      .then(result => {
        console.log('内部领用详情',result);
        return result.data
      })
      .then(data => data || Promise.reject('获取详情失败'))
      .catch(err => Promise.reject(`获取详情数据失败：${err}`))
  }
  //内部领用
  getReceiverOptions(): Promise<Array<SelectOption>> {
    let url = Urls.chain.concat('/Employees/GetByKey?key=ST');
    return this.httpService.get<ListResult<any>>(url)
      .then(result => result.data)
      .then(data => Array.isArray(data) ? data : [])
      .then(data => data.map(m => new SelectOption(m.name, m.id)))
      .catch(err => Promise.reject(`获取领用人选项失败：${err}`));
  }
  getDepartmentsByReceiver(id: string): Promise<Array<SelectOption>> {
    let url = Urls.chain.concat('/Departments/GetDataByEmployee/', id);
    return this.httpService.get<ListResult<any>>(url)
      .then(result => result.data)
      .then(data => Array.isArray(data) ? data : [])
      .then(data => data.map(m => new SelectOption(m.name, m.id)))
      .catch(err => Promise.reject(`获取部门选项失败：${err}`))
  }
  constructor(private httpService: HttpService) { }
}

export class ReceiveRequest extends PagedParams {
  constructor(
    public takeUser?: '',//领用人
    public takeDepart?: '',//部门
    public searchStart?: string,
    public searchEnd?: string,
    public orgIds?: Array<any>, //门店查询
  ) {
    super();
  }
}