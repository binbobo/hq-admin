import { Injectable } from '@angular/core';
import { SelectOption, ListResult } from 'app/shared/models';
import { Urls, HttpService } from 'app/shared/services';

@Injectable()
export class ReceiveService {

  constructor(private httpService: HttpService) { }

  generate(data: ReceiveListRequest): Promise<void> {
    let url = Urls.chain.concat('/StoreInOutDetails/CreateSaleBill');
    return this.httpService.post<void>(url, data)
      .catch(err => Promise.reject(`生成销售清单失败：${err}`))
  }

  getReceiverOptions(): Promise<Array<SelectOption>> {
    let url = Urls.chain.concat('/Employees/GetByKey?key=ST');
    return this.httpService.get<ListResult<any>>(url)
      .then(result => result.data)
      .then(data => Array.isArray(data) ? data : [])
      .then(data => data.map(m => new SelectOption(m.name, m.id)))
      .catch(err => Promise.reject(`获取领用人选项失败：${err}`));
  }

  getDepartmentsByReceiver(id: string): Promise<Array<SelectOption>> {
    let url = Urls.chain.concat('/Departments/GetDataByEmployee/', id);
    return this.httpService.get<ListResult<any>>(url)
      .then(result => result.data)
      .then(data => Array.isArray(data) ? data : [])
      .then(data => data.map(m => new SelectOption(m.name, m.id)))
      .catch(err => Promise.reject(`获取部门选项失败：${err}`))
  }
}

export class ReceiveListRequest {
  constructor(
    public inUnit?: string,
    public seller?: string,
    public list?: Array<ReceiveListItem>,
  ) { }
}

export class ReceiveListItem {
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
