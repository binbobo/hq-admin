import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { BasicService, PagedResult, PagedParams, ListResult, SelectOption, BasicModel, ApiResult } from 'app/shared/models';

@Injectable()
export class ClientService implements BasicService<Client> {

  constructor(private httpService: HttpService) { }

  getSelectOptions(): Promise<Array<SelectOption>> {
    let url = Urls.platform.concat('/clients/options');
    return this.httpService.get<ListResult<SelectOption>>(url)
      .then(result => result.data)
      .then(data => data || Promise.reject('返回数据无效'))
      .catch(err => Promise.reject(`客户端列表加载失败：${err}`));
  }

  getPagedList(params: PagedParams): Promise<PagedResult<Client>> {
    let url = Urls.platform.concat('clients');
    let search = params.serialize();
    return this.httpService.get<PagedResult<Client>>(url, search)
      .catch(err => Promise.reject(`客户端列表加载失败：${err}`));
  }
  get(id: string): Promise<Client> {
    let url = Urls.localization.concat('/clients/', id);
    return this.httpService
      .get<ApiResult<Client>>(url)
      .then(result => result.data);
  }
  create(body: Client): Promise<Client> {
    let url = Urls.localization.concat('/clients');
    return this.httpService
      .post<ApiResult<Client>>(url, body)
      .then(resp => resp.data)
      .catch(err => Promise.reject(`客户端添加失败：${err}`));
  }
  update(body: Client): Promise<void> {
    let url = Urls.localization.concat('/clients/', body.id);
    return this.httpService
      .put<void>(url, body)
      .catch(err => Promise.reject(`客户端编辑失败：${err}`));
  }
  patch(body: Client): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    let url = Urls.localization.concat('/clients/', id);
    return this.httpService
      .delete(url)
      .catch(err => Promise.reject(`客户端删除失败${err}`));
  }
}

export class Client extends BasicModel {
  constructor(
    public applicationId?: string,
    public applicationName?: string,
    public key?: string,
    public name?: string,
    public logo?: string,
  ) { super(); }
}

export class ClientListRequest extends PagedParams {
  constructor(
    public applicationId?: string,
    public name?: string,
    public key?: string
  ) { super("ClientListRequest"); }
}
