import { Injectable } from '@angular/core';
import { BasicService, PagedParams, PagedResult, ApiResult, SelectOption, ListResult } from "app/shared/models";
import { HttpService, Urls } from "app/shared/services";

@Injectable()
export class InvoicingService implements BasicService<any>{
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
  public getPagedList(params: InvoicingRequest): Promise<PagedResult<any>> {
    const url = Urls.chain.concat('/StoreInOutDetails/PurchaseSellStockList?', params.serialize());
    console.log("url", url);
    return this.httpService.get<PagedResult<any>>(url)
      .then(result => {
        console.log('进销存数据', result);
        return result;
      })
      .catch(err => Promise.reject(`进销存数据失败：${err}`));
  }

  //导出
  public export(params: InvoicingRequest): Promise<void> {
    const url = Urls.chain.concat('/StoreInOutDetails/PurSellStockDetailsExportToExcel');
    return this.httpService
      .download(url, params.serialize(), '进销存入库统计')
      .catch(err => Promise.reject(`进销存入库统计导出失败：${err}`));
  }

  //详情
  public get(id: string): Promise<any> {
    const url = Urls.chain.concat('/StoreInOutDetails/PurchaseSellStockDetailsList?StoreId=9f885937-c43b-484e-aba4-0aaf7039c2b2&BillId=',id);
    return this.httpService
      .get<ApiResult<any>>(url)
      .then(result => result.data)
      .then(data => data || Promise.reject('获取详情失败'))
      .catch(err => Promise.reject(`获取详情数据失败：${err}`))
  }
  /**
     * 获取仓库下拉选项
     */
  public getWarehouseOptions(): Promise<Array<SelectOption>> {
    let url = Urls.chain.concat('/storehouses?orgid=9f885937-c43b-484e-aba4-0aaf7039c2b2');
    return this.httpService.get<ListResult<any>>(url)
      .then(result => result.data)
      .then(data => data.map(m => new SelectOption(m.name, m.id)))
      .catch(err => Promise.reject(`获取仓库选项失败：${err}`));
  }
  constructor(private httpService: HttpService) { }
}

export class InvoicingRequest extends PagedParams {
  constructor(
    public storeId?:string, //仓库
    public searchStart?: string,
    public searchEnd?: string,
    public billCode?: string,//单号
    public name?: string, //供应商
    public orgIds?: Array<any>, //门店查询
  ) {
    super();
  }
}