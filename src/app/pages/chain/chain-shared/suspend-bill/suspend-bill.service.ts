import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { SelectOption, ListResult, PagedResult, PagedParams, ApiResult } from 'app/shared/models';
import { DatePipe } from '@angular/common';

@Injectable()
export class SuspendBillsService {
  constructor(
    private httpService: HttpService
  ) { }

  /**
   * 获取挂单列表
   */
  public get(type: string): Promise<PagedResult<SuspendedBillItem>> {
    let url = Urls.chain.concat('/SuspendedBills/GetAll?type=', type);
    return this.httpService.get<PagedResult<SuspendedBillItem>>(url)
      .then(result => {
        result.data.forEach(m => m.value = this.getItem(m.data));
        return result;
      })
      .catch(err => [])
  }

  private getItem(data: string) {
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (error) {
      return {};
    }
  }

  /** 挂单*/
  public create(data: object, type: string, billId?: string): Promise<void> {
    let body = { type: type, data: JSON.stringify(data) };
    let url = Urls.chain.concat('/SuspendedBills');
    return this.httpService.post<void>(url, body)
      .catch(err => Promise.reject(`挂单操作失败：${err}`));
  }

  /**更新挂单信息 */
  public update(data: object, type: string, billId: string): Promise<void> {
    let body = { type: type, data: JSON.stringify(data) };
    let url = Urls.chain.concat('/SuspendedBills/', billId);
    return this.httpService.put<void>(url, body)
      .catch(err => Promise.reject(`更新挂单失败：${err}`));
  }

  /**删除挂单信息 */
  public delete(id) {
    let url = Urls.chain.concat('/SuspendedBills/', id);
    return this.httpService.delete(url)
      .catch(err => Promise.reject(`删除失败`));
  }
}

export class SuspendedBillItem {
  public id: string;
  public type: string;
  public data: string;
  public value: any;
  public operator: string;
  public createBillTime: string;
}

export class GenerateSuspendedBillRequest {
  public suspendedBillId?: string
}

export class GenerateSuspendedBillResponse<T> extends ApiResult<T> {
  public id?: string;
  public type?: string;
}