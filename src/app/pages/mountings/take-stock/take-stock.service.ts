import { Injectable } from '@angular/core';
import { PagedParams, BasicService, PagedResult } from 'app/shared/models';
import { Urls, HttpService } from 'app/shared/services';

@Injectable()
export class TakeStockService implements BasicService<Stock> {

  constructor(private httpService: HttpService) { }

  getPagedList(params: PagedParams): Promise<PagedResult<Stock>> {
    let search = params.serialize();
    let url = Urls.chain.concat('/inventorys/getpagelist');
    return this.httpService.get<PagedResult<Stock>>(url, search)
      .catch(err => Promise.reject(`获取盘点列表失败：${err}`));
  }

  get(id: string): Promise<Stock> {
    throw new Error('Method not implemented.');
  }
  create(body: Stock): Promise<Stock> {
    throw new Error('Method not implemented.');
  }
  update(body: Stock): Promise<void> {
    throw new Error('Method not implemented.');
  }
  patch(body: Stock): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

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
