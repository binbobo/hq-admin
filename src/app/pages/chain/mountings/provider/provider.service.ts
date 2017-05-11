import { Injectable } from '@angular/core';
import { BasicModel, BasicService, PagedParams, PagedResult, ApiResult, RequestParams } from 'app/shared/models';
import { HttpService, Urls } from 'app/shared/services';

@Injectable()
export class ProviderService implements BasicService<Provider> {

  constructor(
    private httpService: HttpService,
  ) { }

  export(params: RequestParams): Promise<void> {
    let url = Urls.chain.concat('/suppliers/exportToExcel');
    return this.httpService.download(url, params.serialize())
      .catch(err => `供应商列表导出失败：${err}`);
  }

  getPagedList(params: ProviderListRequest): Promise<PagedResult<Provider>> {
    let url = Urls.chain.concat('/suppliers/getPageList');
    return this.httpService
      .get<PagedResult<Provider>>(url, params.serialize())
      .catch(err => Promise.reject(`供应商列表加载失败：${err}`));
  }
  get(id: string): Promise<Provider> {
    let url = Urls.chain.concat('/suppliers/', id);
    return this.httpService
      .get<ApiResult<Provider>>(url)
      .then(result => result.data)
      .catch(err => Promise.reject(`供应商获取失败：${err}`))
  }
  create(body: Provider): Promise<Provider> {
    let url = Urls.chain.concat('/suppliers');
    return this.httpService
      .post<ApiResult<Provider>>(url, body)
      .then(result => result.data)
      .catch(err => Promise.reject(`供应商添加失败：${err}`))
  }
  update(body: Provider): Promise<void> {
    let url = Urls.chain.concat('/suppliers/', body.id);
    return this.httpService
      .put<void>(url, body)
      .catch(err => Promise.reject(`供应商更新失败：${err}`))
  }
  patch(body: Provider): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    let url = Urls.chain.concat('/suppliers/', id);
    throw new Error('Method not implemented.');
  }
  enable(ids: Array<string>): Promise<void> {
    let params = new EnableRequest(ids);
    let url = Urls.chain.concat('/suppliers/setEnable');
    return this.httpService.put<void>(url, params)
      .catch(err => Promise.reject(`供应商状态更新失败：${err}`));
  }
}

export class ProviderListRequest extends PagedParams {
  constructor(
    public searchInfo?: string,
    public name?: string,
    public contactUser?: string,
    public tel?: string,
  ) {
    super('ProviderListRequest');
  }
}

export class Provider extends BasicModel {
  constructor(
    public code?: string,
    public name?: string,
    public shortName?: string,
    public contactUser?: string,
    public tel?: string,
    public address?: string,
    public postal?: string,
    public fax?: string,
    public status?: string,
  ) {
    super();
  }
}

export class EnableRequest {
  constructor(
    public ids: Array<string>
  ) {
  }
}
