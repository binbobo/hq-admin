import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams, PagedResult, ApiResult, BasicModel, BasicService } from 'app/shared/models';

@Injectable()
export class ResourceService implements BasicService<Resource> {

  patch(body: Resource): Promise<void> {
    throw new Error('Method not implemented.');
  }

  constructor(private httpService: HttpService) { }

  public getPagedList(params: ResourceListRequest): Promise<PagedResult<Resource>> {
    let url = Urls.localization.concat('/resources?', params.serialize());
    return this.httpService
      .get<PagedResult<Resource>>(url)
      .catch(err => Promise.reject(`语言列表加载失败：${err}`));
  }

  public get(id: string): Promise<Resource> {
    let url = Urls.localization.concat('/resources/', id);
    return this.httpService
      .get<ApiResult<Resource>>(url)
      .then(result => result.data);
  }

  public update(body: Resource): Promise<void> {
    let url = Urls.localization.concat('/resources/', body.id);
    return this.httpService
      .put<void>(url, body)
      .catch(err => Promise.reject(`语言属性失败：${err}`));
  }

  public create(body: Resource): Promise<Resource> {
    let url = Urls.localization.concat('/resources');
    return this.httpService
      .post<ApiResult<Resource>>(url, body)
      .then(resp => resp.data)
      .catch(err => Promise.reject(`语言添加失败：${err}`));
  }

  public delete(id: string): Promise<void> {
    let url = Urls.localization.concat('/resources/', id);
    return this.httpService
      .delete(url)
      .catch(err => Promise.reject(`语言删除失败${err}`));
  }
}

export class Resource extends BasicModel {
  constructor(
    public groups: Array<string> = [],
    public key?: string,
    public value?: string,
    public languageId?: string,
    public languageName?: string,
  ) { super(); }
}

export class ResourceListRequest extends PagedParams {
  constructor(
    public languageId: string = "",
    public groupId: string = "",
    public key?: string,
  ) {
    super('ResourceListRequestParams');
  }
}