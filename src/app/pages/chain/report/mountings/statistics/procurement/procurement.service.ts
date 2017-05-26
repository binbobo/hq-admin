import { Injectable } from '@angular/core';
import { BasicService, PagedParams, PagedResult, ApiResult } from "app/shared/models";
import { HttpService, Urls } from "app/shared/services";

@Injectable()
export class ProcurementService implements BasicService<any>{
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
  public getPagedList(params: ProcurementRequest): Promise<PagedResult<any>> {
    const url = Urls.chain.concat('/Purchases/Statistic?', params.serialize());
    console.log("url", url);
    return this.httpService.get<PagedResult<any>>(url)
      .then(result => {
        console.log('采购入库数据', result);
        return result;
      })
      .catch(err => Promise.reject(`采购入库数据失败：${err}`));
  }

  //导出
  public export(params: ProcurementRequest): Promise<void> {
    const url = Urls.chain.concat('/Purchases/StatisticExportToExcel');
    return this.httpService
      .download(url, params.serialize(), '采购入库统计')
      .catch(err => Promise.reject(`采购入库统计导出失败：${err}`));
  }

  //详情
  public get(id: string): Promise<any> {
    const url = Urls.chain.concat('/PurchaseDetails/Details/',id);
    return this.httpService
      .get<ApiResult<any>>(url)
      .then(result => result.data)
      .then(data => data || Promise.reject('获取详情失败'))
      .catch(err => Promise.reject(`获取详情数据失败：${err}`))
  }
  constructor(private httpService: HttpService) { }
}

export class ProcurementRequest extends PagedParams {
  constructor(
    public searchStart?: string,
    public searchEnd?: string,
    public name?: string, //供应商
    public orgIds?: Array<any>, //门店查询
  ) {
    super();
  }
}