import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams, PagedResult, PagedService, ApiResult } from 'app/shared/models';
import * as moment from 'moment';


@Injectable()
export class JournalAccountService implements PagedService<JournalAccount> {

  constructor(private httpService: HttpService) { }

  public getProduct(id: string) {
    let url = Urls.chain.concat('/StoreInOutDetails/Product/', id);
    return this.httpService.get<ApiResult<any>>(url)
      .then(result => result.data)
      .catch(err => Promise.reject(`获取配件信息失败：${err}`));
  }

  public getPagedList(params: JournalAccountListRequest): Promise<JournalAccountListResponse> {
    if (!params.productId) return Promise.resolve(new PagedResult());
    let url = Urls.chain.concat('/storeInOutDetails/ProductSerialPageList');
    let search = params.serialize();
    return this.httpService.get<JournalAccountListResponse>(url, search)
      .catch(err => Promise.reject(`账单加载失败：${err}`));
  }

  public export(params: JournalAccountListRequest): Promise<void> {
    let url = Urls.chain.concat('/storeInOutDetails/productSerialExportToExcel');
    let p = new JournalAccountListRequest();
    Object.assign(p, params);
    p.setPage(undefined, undefined);
    let search = p.serialize();
    return this.httpService.download(url, search)
      .catch(err => Promise.reject(`流水账导出失败：${err}`));
  }

}

export class JournalAccount {
  constructor(
    public number?: number,
    public billCode?: string,
    public createTime?: string,
    public billType?: string,
    public inCount?: number,
    public outCount?: number,
    public price?: string,
    public amount?: string,
    public saleAmount?: string,
    public count?: number,
    public plateNo?: string,
    public supplier?: string,
    public customer?: string,
    public operator?: string,
  ) { }
}

export class JournalAcountType {
  constructor(
    public name?: string,
    public count?: string,
    public type?: string,
    public checked?: boolean
  ) { }
}

export class JournalAccountListRequest extends PagedParams {
  constructor(
    public billTypeKey?: string,
    public productId?: string,
    public createStartTime?: string,
    public createEndTime?: string,
  ) {
    super();
  }

  serialize() {
    return super.serialize({ endTimeDate: this.createEndTime + 'T23:59:59.999' });
  }
}

export class JournalAccountListResponse extends PagedResult<JournalAccount>{
  constructor(
    public tabList?: Array<JournalAcountType>
  ) {
    super();
  }
}