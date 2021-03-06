import { Injectable } from '@angular/core';
import { BasicService, PagedParams, PagedResult, ApiResult, SelectOption, ListResult } from "app/shared/models";
import { HttpService, Urls } from "app/shared/services";
import * as moment from 'moment';

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

  //详情搜索
  public getDetailPagedList(id: string, paramsDetail: InvoicingRequest): Promise<PagedResult<any>> {
    let url = Urls.chain.concat('/StoreInOutDetails/PurchaseSellStockDetailsList?storeId=', id, '&', paramsDetail.serialize());
    console.log("url", url);
    return this.httpService.get<PagedResult<any>>(url)
      .then(result => {
        console.log('进销存详情数据', result);
        return result;
      })
      .catch(err => Promise.reject(`进销存详情数据失败：${err}`));
  }
 
  //导出
  public export(params: InvoicingRequest): Promise<void> {
    const url = Urls.chain.concat('/StoreInOutDetails/PurSellStockExportToExcel');
    return this.httpService
      .download(url, params.serialize())
      .catch(err => Promise.reject(`进销存入库统计导出失败：${err}`));
  }
  //详情导出
  public exportDetsil(id: string,  paramsDetail: InvoicingRequest): Promise<void> {
    const url = Urls.chain.concat('/StoreInOutDetails/PurSellStockDetailsExportToExcel?StoreId=', id,'&');
    return this.httpService
      .download(url, paramsDetail.serialize())
      .catch(err => Promise.reject(`进销存入库详情统计导出失败：${err}`));
  }
  //
  public get(id: string): Promise<any> {
    const url = Urls.chain.concat('/StoreInOutDetails/PurchaseSellStockDetailsList?StoreId=9f885937-c43b-484e-aba4-0aaf7039c2b2&BillId=', id);
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
    public storeId?: string, //仓库
    public searchStart?: string,
    public searchEnd?: string,
    public billCode?: string,//单号
    public name?: string, //供应商
    public orgIds?: Array<any>, //门店查询
  ) {
    super();
    this.searchStart = searchStart || moment().subtract(30, 'd').format('YYYY-MM-DD');
    this.searchEnd = searchEnd || moment().format('YYYY-MM-DD');
  }
}
export class InvoicingDetailRequest extends PagedParams {
  constructor(
    public productCode?: string, //配件编码
    public productName?: string, //配件名称
    public searchStart?: string,
    public searchEnd?: string,
    public billCode?: string,//单号
    public name?: string, //供应商
    public orgIds?: Array<any>, //门店查询
  ) {
    super();
    this.searchStart = searchStart || moment().subtract(30, 'd').format('YYYY-MM-DD');
    this.searchEnd = searchEnd || moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
  }
}