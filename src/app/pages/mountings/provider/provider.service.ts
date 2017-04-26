import { Injectable } from '@angular/core';
import { BasicModel, BasicService, PagedParams, PagedResult } from 'app/shared/models';
import { HttpService, Urls } from 'app/shared/services';

@Injectable()
export class ProviderService implements BasicService<Provider> {

  constructor(
    private httpService: HttpService,
  ) { }

  getPagedList(params: PagedParams): Promise<PagedResult<Provider>> {
    let url = Urls.chain.concat('/suppliers/getPageList?', params.serialize());
    return this.httpService
      .get<PagedResult<Provider>>(url)
      .catch(err => Promise.reject(`供应商列表加载失败：${err}`));
  }
  get(id: string): Promise<Provider> {
    throw new Error('Method not implemented.');
  }
  create(body: Provider): Promise<Provider> {
    throw new Error('Method not implemented.');
  }
  update(body: Provider): Promise<void> {
    throw new Error('Method not implemented.');
  }
  patch(body: Provider): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

}

export class ProviderListRequest extends PagedParams {
  constructor(
    public orgid: string = '53113bfb-d2cf-43a8-a0d0-c5b5a61d0c07',
  ) {
    super('ProviderListRequest');
  }
}

export class Provider extends BasicModel {

}
