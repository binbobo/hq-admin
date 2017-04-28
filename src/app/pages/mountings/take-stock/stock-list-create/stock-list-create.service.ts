import { Injectable } from '@angular/core';
import { PagedParams, BasicService, PagedResult } from 'app/shared/models';
import { Urls, HttpService } from 'app/shared/services';

@Injectable()
export class StockListCreateService implements BasicService<CreateStock> {

  constructor(private httpService: HttpService) { }

  getPagedList(params: PagedParams): Promise<PagedResult<CreateStock>> {
    let search = params.serialize();
    let url = Urls.chain.concat('/inventoryDetails/getList');
    return this.httpService.get<PagedResult<CreateStock>>(url, search)
      .catch(err => Promise.reject(`获取配件列表失败：${err}`));
  }

  get(id: string): Promise<CreateStock> {
    throw new Error('Method not implemented.');
  }
  create(body: CreateStock): Promise<CreateStock> {
    throw new Error('Method not implemented.');
  }
  update(body: CreateStock): Promise<void> {
    throw new Error('Method not implemented.');
  }
  patch(body: CreateStock): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export class CreateStockListRequest extends PagedParams {
  constructor(
    public locationId?: string,
    public inventoryId?: string
  ) { super('CreateStockListRequest'); }
}

export class CreateStock {
  constructor(
    public number: string,
    public productBrand: string,
    public productCode: string,
    public productName: string,
    public productSpecification: string,
    public billId: string,
    public billCode: string,
    public houseName: string,
    public locationName: string,
    public stock: number,
    public count: number,
    public price: number,
    public createUserId: string,
    public createUser: string,
    public operator: string,
    public createdOn: string
  ) { }
}
