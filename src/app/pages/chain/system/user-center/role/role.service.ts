import { Injectable } from '@angular/core';
import { BasicService, BasicModel, PagedParams, PagedResult } from 'app/shared/models';
import { Urls, HttpService } from 'app/shared/services';

@Injectable()
export class RoleService implements BasicService<Role> {
  create(body: Role): Promise<Role> {
    let url = Urls.chain.concat();
    return this.httpService.post<Role>(url, body)
      .catch(err => Promise.reject(`添加角色失败：${err}`));
  }
  update(body: Role): Promise<void> {
    let url = Urls.chain.concat();
    return this.httpService.put<void>(url, body)
      .catch(err => Promise.reject(`添加角色失败：${err}`));
  }
  patch(body: Role): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getPagedList(params: PagedParams): Promise<PagedResult<Role>> {
    let url = Urls.chain.concat();
    return this.httpService.getPagedList<Role>(url, params)
      .catch(err => Promise.reject(`获取角色列表失败：${err}`));
  }
  get(id: string): Promise<Role> {
    let url = Urls.chain.concat();
    return this.httpService.get<Role>(url)
      .catch(err => Promise.reject(`获取角色信息失败：${err}`));
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  allocate(body: any): Promise<void> {
    let url = Urls.chain.concat();
    return this.httpService.post<void>(url, body)
      .catch(err => Promise.reject(`分配权限失败：${err}`));
  }

  constructor(private httpService: HttpService) { }

}

export class Role extends BasicModel {
  constructor(
    public name?: string
  ) {
    super();
  }
}

export class RoleSearchParams extends PagedParams {
  constructor(
    public name?: string
  ) {
    super();
  }
}