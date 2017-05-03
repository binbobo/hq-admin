import { Injectable } from '@angular/core';
import { PagedParams, PagedResult, PagedService } from 'app/shared/models';
import { Urls, HttpService } from 'app/shared/services';

@Injectable()
export class StockListCreateService implements PagedService<CreateStock> {

  constructor(private httpService: HttpService) { }

  getPagedList(params: PagedParams): Promise<PagedResult<CreateStock>> {
    let search = params.serialize();
    let url = Urls.chain.concat('/inventoryDetails/getList');
    return this.httpService.get<PagedResult<CreateStock>>(url, search)
      .catch(err => Promise.reject(`获取配件列表失败：${err}`));
  }
}

export class CreateStockListRequest extends PagedParams {
  constructor(
    public inventoryId: string = '',
    public locationId?: Array<string>
  ) { super(); }
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
