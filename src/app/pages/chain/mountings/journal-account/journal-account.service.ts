import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams, PagedResult, PagedService } from 'app/shared/models';


@Injectable()
export class JournalAccountService implements PagedService<JournalAccount> {

  constructor(private httpService: HttpService) { }

  public getPagedList(params: JournalAccountListRequest): Promise<JournalAccountListResponse> {
    if (!params.productId) return Promise.resolve(new PagedResult());
    let url = Urls.chain.concat('/storeInOutDetails/ProductSerialPageList');
    let search = params.serialize();
    return this.httpService.get<JournalAccountListResponse>(url, search)
      .then(result => {
        if (result.tabList) {
          result.tabList.forEach(m => m.checked = m.type === params.billType);
        }
        return result;
      })
      .catch(err => Promise.reject(`账单加载失败：${err}`));
  }

  public getMountings(params: MountingListRequest): Promise<PagedResult<any>> {
    let url = Urls.chain.concat('/products/getListByNameOrCode');
    let search = params.serialize();
    return this.httpService.get<PagedResult<any>>(url, search)
      .catch(err => Promise.reject(`配件加载失败：${err}`));
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
    public billType: string = '',
    public productId?: string,
    public CreateStartTime?: string,
    public CreateEndTime?: string
  ) {
    super();
  }
}

export class MountingListRequest extends PagedParams {
  constructor(
    public code?: string,
    public name?: string,
  ) {
    super();
  }
}

export class JournalAccountListResponse extends PagedResult<JournalAccount>{
  constructor(
    public tabList?: Array<JournalAcountType>
  ) {
    super();
  }
}