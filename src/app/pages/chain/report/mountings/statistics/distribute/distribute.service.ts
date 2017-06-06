import { Injectable } from '@angular/core';
import { BasicService, PagedParams, PagedResult, ApiResult } from "app/shared/models";
import { HttpService, Urls } from "app/shared/services";
import * as moment from 'moment';

@Injectable()
export class DistributeService implements BasicService<any>{
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
  public getPagedList(params: DistributeRequest): Promise<PagedResult<any>> {
    const url = Urls.chain.concat('/StoreInOutDetails/MMStatic?', params.serialize());
    console.log("url", url);
    return this.httpService.get<PagedResult<any>>(url)
      .then(result => {
        console.log('维修发料数据', result);
        return result;
      })
      .catch(err => Promise.reject(`维修发料数据失败：${err}`));
  }

  //导出
  public export(params: DistributeRequest): Promise<void> {
    const url = Urls.chain.concat('/StoreInOutDetails/MMStoreStatic');
    console.log('导出', url)
    return this.httpService
      .download(url, params.serialize())
      .catch(err => Promise.reject(`维修发料统计导出失败：${err}`));
  }

  //详情
  public get(id: string): Promise<any> {
    const url = Urls.chain.concat('/StoreInOutDetails/MMDetailStatic?BillId=',id);
    return this.httpService
      .get<ApiResult<any>>(url)
      .then(result => {
        console.log('维修发料统计详情',result.data);
        return result.data;
      })
      .then(data => {
        console.log('data',data)
        return data || Promise.reject('获取详情失败')
      })
      .catch(err => Promise.reject(`获取详情数据失败：${err}`))
  }
  constructor(private httpService: HttpService) { }
}

export class DistributeRequest extends PagedParams {
  constructor(
    public plateNo?: string,
    public searchStart?: string,
    public searchEnd?: string,
    public orgIds?: Array<any>, //门店查询
  ) {
    super();
    this.searchStart = searchStart || moment().subtract(30, 'd').format('YYYY-MM-DD');
    this.searchEnd = searchEnd || moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
  }
}