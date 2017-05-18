import { Injectable } from '@angular/core';
import { PagedParams, BasicService, PagedResult, PagedService, ListResult, ApiResult } from 'app/shared/models';
import { Urls, HttpService } from 'app/shared/services';

@Injectable()
export class TakeStockService implements PagedService<Stock> {

  constructor(private httpService: HttpService) { }

  getPagedList(params: PagedParams): Promise<PagedResult<Stock>> {
    let search = params.serialize();
    let url = Urls.chain.concat('/inventorys/getpagelist');
    return this.httpService.get<PagedResult<Stock>>(url, search)
      .catch(err => Promise.reject(`获取盘点列表失败：${err}`));
  }

  get(id: string): Promise<any> {
    let url = Urls.chain.concat('/InventoryDetails/GetListByBillCode?billCode=', id);
    return this.httpService.get<ApiResult<any>>(url)
      .then(result => result.data)
      .catch(err => Promise.reject(`获取详情失败：${err}`));
  }

  create(body: GenerateStockListRequest): Promise<void> {
    let url = Urls.chain.concat('/InventoryDetails/CreateInventory');
    return this.httpService.post<void>(url, body)
      .catch(err => Promise.reject(`清单生成失败：${err}`));
  }

  export(code: string): Promise<void> {
    let url = Urls.chain.concat('/InventoryDetails/ExportToExcel?billcode=', code);
    return this.httpService.download(url)
      .catch(err => Promise.reject(`盘点清单导出失败：${err}`));
  }

}

export class GenerateStockListRequest {
  constructor(
    public storeId?: string,
    public locationId?: Array<string>,
  ) { }
}

export class StockListRequest extends PagedParams {
  constructor(
    public billCode?: string,
    public createTimeStart?: string,
    public createTimeEnd?: string,
    public operator?: string
  ) { super('StockListRequest'); }
}

export class Stock {
  constructor(
    public billCode: string,
    public leader: string,
    public id: string,
    public createdOnUtc: string,
    public houseName: string,
    public operator: string,
  ) { }
}
