import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams, PagedResult, PagedService } from 'app/shared/models';


@Injectable()
export class JournalAccountService implements PagedService<JournalAccount> {

  getPagedList(params: PagedParams): Promise<PagedResult<JournalAccount>> {
    if (!params['productId']) return Promise.resolve(new PagedResult());
    let url = Urls.chain.concat('/storeInOutDetails/productSerialList');
    let search = params.serialize();
    return this.httpService.get<PagedResult<JournalAccount>>(url, search)
      .catch(err => Promise.reject(`账单加载失败：${err}`));
  }

  public getMountings(params: MountingListRequest): Promise<PagedResult<any>> {
    let url = Urls.chain.concat('/products/getListByNameOrCode');
    let search = params.serialize();
    return this.httpService.get<PagedResult<any>>(url, search)
      .catch(err => Promise.reject(`配件加载失败：${err}`));
  }

  constructor(private httpService: HttpService) { }

}

export class JournalAccount {

}

export class JournalAccountListRequest extends PagedParams {
  constructor(
    public productId?: string,
    public CreateStartTime?: string,
    public CreateEndTime?: string
  ) {
    super('JournalAccountListRequest');
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