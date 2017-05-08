import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { ListResult, SelectOption } from 'app/shared/models';
import { GenerateSuspendedBillRequest, GenerateSuspendedBillResponse } from '../../suspended-bills.service';

@Injectable()
export class SalesService {

  constructor(private httpService: HttpService) { }

  generate(data: SalesListRequest): Promise<GenerateSuspendedBillResponse<SalesListRequest>> {
    let url = Urls.chain.concat('/StoreInOutDetails/CreateSaleBill');
    return this.httpService.post<GenerateSuspendedBillResponse<SalesListRequest>>(url, data)
      .catch(err => Promise.reject(`生成销售清单失败：${err}`))
  }

  getSalesmanOptions(): Promise<Array<SelectOption>> {
    let url = Urls.chain.concat('/Employees/GetByKey?key=Seller');
    return this.httpService.get<ListResult<any>>(url)
      .then(result => result.data)
      .then(data => Array.isArray(data) ? data : [])
      .then(data => data.map(m => new SelectOption(m.name, m.id)))
      .catch(err => Promise.reject(`获取销售员选项失败：${err}`));
  }
}

export class SalesListRequest extends GenerateSuspendedBillRequest {
  constructor(
    public custName?: string,
    public custPhone?: string,
    public seller?: string,
    public list?: Array<SalesListItem>,
  ) {
    super()
  }
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