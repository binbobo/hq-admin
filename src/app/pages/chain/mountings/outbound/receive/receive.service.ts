import { Injectable } from '@angular/core';
import { SelectOption, ListResult, ApiResult } from 'app/shared/models';
import { Urls, HttpService } from 'app/shared/services';

@Injectable()
export class ReceiveService {

  constructor(private httpService: HttpService) { }

  get(code: string): Promise<ReceivePrintItem> {
    if (!code) return Promise.resolve({});
    let url = Urls.chain.concat('/UseDetails/Print?BillCode=', code);
    return this.httpService.get<ApiResult<any>>(url)
      .then(result => result.data)
      .catch(err => Promise.reject(`获取内部领用单信息失败：${err}`));
  }

  generate(data: ReceiveListRequest): Promise<string> {
    let url = Urls.chain.concat('/StoreInOutDetails/CreateUseBill');
    return this.httpService.post<ApiResult<string>>(url, data)
      .then(result => result.data)
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

export class ReceivePrintItem {
  public title?: string;
  public billCode?: string;
  public createBillDateTime?: string;
  public takeUser?: string;
  public department?: string;
  public totalAmount: string;
  public printDateTime: string;
  public operator: string;
  public list: Array<any>
}

export class ReceiveListRequest {
  constructor(
    public list: Array<ReceiveListItem> = [],
    public takeUser?: string,
    public takeDepart?: string,
    public suspendedBillId?: string,
  ) { }

  get valid() {
    return this.takeUser && this.takeDepart && this.list && this.list.length;
  }
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
    public houseName?: string,
    public productUnit?: string,
  ) { }
}
