import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { ListResult, SelectOption } from 'app/shared/models';

@Injectable()
export class SalesService {

  constructor(private httpService: HttpService) { }

  generate(data: SalesListRequest): Promise<void> {
    let url = Urls.chain.concat('/StoreInOutDetails/CreateSaleBill');
    return this.httpService.post<void>(url, data)
      .catch(err => Promise.reject(`生成销售清单失败：${err}`))
  }

  getSalesmanOptions(): Promise<Array<SelectOption>> {
    let url = Urls.chain.concat('/Employees/GetByKey?key=Seller');
    return this.httpService.get<ListResult<any>>(url)
      .then(result => result.data)
      .then(data => data.map(m => new SelectOption(m.name, m.id)))
      .catch(err => Promise.reject(`获取销售员选项失败：${err}`));
  }
}

export class SalesListRequest {
  constructor(
    public inUnit?: string,
    public seller?: string,
    public list?: Array<SalesListItem>,
  ) { }
}

export class SalesListItem {
  constructor(
    public count: number = 0,
    public price: number = 0,
    public amount: number = 0,
    public stockCount: number = 0,
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