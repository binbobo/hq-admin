import { Injectable } from '@angular/core';
import { BasicModel, BasicService, PagedParams, PagedResult, ApiResult, SelectOption, ListResult } from 'app/shared/models';
import { HttpService, Urls } from 'app/shared/services';

@Injectable()
export class ApplicationService implements BasicService<Application> {

  constructor(private httpService: HttpService) { }

  getSelectOptions(): Promise<Array<SelectOption>> {
    let url = Urls.platform.concat('/applications/options');
    return this.httpService.get<ListResult<SelectOption>>(url)
      .then(result => result.data)
      .then(data => data || Promise.reject('无效的返回结果'))
      .catch(err => Promise.reject(`获取应用选项失败：${err}`));
  }

  getPagedList(params: PagedParams): Promise<PagedResult<Application>> {
    let url = Urls.platform.concat('/applications');
    let search = params.serialize();
    return this.httpService.get<PagedResult<Application>>(url, search)
      .catch(err => Promise.reject(`获取应用列表失败：${err}`));
  }
  get(id: string): Promise<Application> {
    let url = Urls.platform.concat('/applications/', id);
    return this.httpService.get<ApiResult<Application>>(url)
      .then(result => result.data)
      .then(data => data || Promise.reject('无效的返回结果'))
      .catch(err => Promise.reject(`获取应用失败：${err}`));
  }
  create(body: Application): Promise<Application> {
    let url = Urls.platform.concat('/applications');
    return this.httpService.post<ApiResult<Application>>(url, body)
      .catch(err => Promise.reject(`应用添加失败：${err}`));
  }
  update(body: Application): Promise<void> {
    let url = Urls.platform.concat('/applications/', body.id);
    return this.httpService
      .put<void>(url, body)
      .catch(err => Promise.reject(`应用修改失败：${err}`));
  }
  patch(body: Application): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    let url = Urls.localization.concat('/applications/', id);
    return this.httpService
      .delete(url)
      .catch(err => Promise.reject(`应用删除失败${err}`));
  }
}

export class Application extends BasicModel {
  constructor(
    public name?: string,
    public logo?: string,
  ) {
    super();
  }
}

export class ApplicationListRequest extends PagedParams {
  constructor(
    name?: string
  ) {
    super('ApplicationListRequest');
  }
}
