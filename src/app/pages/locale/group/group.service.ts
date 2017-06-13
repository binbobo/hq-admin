import { Injectable } from '@angular/core';
import { Urls, HttpService } from 'app/shared/services';
import { PagedParams, PagedResult, ApiResult, BasicService, BasicModel, SelectOption, ListResult } from 'app/shared/models';

@Injectable()
export class GroupService implements BasicService<Group> {

  constructor(private httpService: HttpService) { }

  public getPagedList(params: GroupListRequest): Promise<PagedResult<Group>> {
    let url = Urls.localization.concat('/groups?', params.serialize());
    return this.httpService
      .get<PagedResult<Group>>(url)
      .catch(err => Promise.reject(`资源分组列表加载失败：${err}`));
  }

  public getOptionList(): Promise<Array<SelectOption>> {
    let url = Urls.localization.concat('/groups/options');
    return this.httpService
      .getList<SelectOption>(url)
      .catch(err => Promise.reject(`资源分组加载失败:${err}`));
  }

  public get(id: string): Promise<Group> {
    let url = Urls.localization.concat('/groups/', id);
    return this.httpService
      .get<ApiResult<Group>>(url)
      .then(result => result.data);
  }

  public update(body: Group): Promise<void> {
    let url = Urls.localization.concat('/groups/', body.id);
    return this.httpService
      .put<void>(url, body)
      .catch(err => Promise.reject(`资源分组更新失败：${err}`));
  }

  public create(body: Group): Promise<Group> {
    let url = Urls.localization.concat('/groups');
    return this.httpService
      .post<ApiResult<Group>>(url, body)
      .then(resp => resp.data)
      .catch(err => Promise.reject(`资源分组添加失败：${err}`));
  }

  patch(body: Group): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public delete(id: string): Promise<void> {
    let url = Urls.localization.concat('/groups/', id);
    return this.httpService
      .delete(url)
      .catch(err => Promise.reject(`资源分组删除失败${err}`));
  }
}

export class Group extends BasicModel {
  public groupName: string;
}

export class GroupListRequest extends PagedParams {
  constructor() { super("GroupListRequestParams"); }
  public groupName: string;
}