import { Injectable } from '@angular/core';
import { Urls, HttpService } from 'app/shared/services';
import { PagedParams, PagedResult, ApiResult, BasicService, BasicModel } from 'app/shared/models';

@Injectable()
export class PropertyService implements BasicService<Property> {

  patch(body: Property): Promise<void> {
    throw new Error('Method not implemented.');
  }

  constructor(private httpService: HttpService) { }

  public getPagedList(params: PropertyListRequest): Promise<PagedResult<Property>> {
    let url = Urls.localization.concat('/properties?', params.serialize());
    return this.httpService
      .get<PagedResult<Property>>(url)
      .catch(err => Promise.reject(`语言列表加载失败：${err}`));
  }

  public get(id: string): Promise<Property> {
    let url = Urls.localization.concat('/properties/', id);
    return this.httpService
      .get<ApiResult<Property>>(url)
      .then(result => result.data);
  }

  public update(body: Property): Promise<void> {
    let url = Urls.localization.concat('/properties/', body.id);
    return this.httpService
      .put<void>(url, body)
      .catch(err => Promise.reject(`语言属性失败：${err}`));
  }

  public create(body: Property): Promise<Property> {
    let url = Urls.localization.concat('/properties');
    return this.httpService
      .post<ApiResult<Property>>(url, body)
      .then(resp => resp.data)
      .catch(err => Promise.reject(`语言添加失败：${err}`));
  }

  public delete(id: string): Promise<void> {
    let url = Urls.localization.concat('/properties/', id);
    return this.httpService
      .delete(url)
      .catch(err => Promise.reject(`语言删除失败${err}`));
  }
}

export class Property extends BasicModel {
  constructor(
    public entityId?: string,
    public key?: string,
    public value?: string,
    public groupName?: string,
    public languageId?: string,
    public language?: string,
  ) { super(); }
}

export class PropertyListRequest extends PagedParams {
  constructor(
    public enabled = "",
    public languageId: string = "",
    public entityId?: string,
    public key?: string,
    public groupName?: string,
  ) {
    super('PropertyListRequestParams');
  }
}