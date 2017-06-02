import { Injectable } from '@angular/core';
import { BasicService, PagedParams, PagedResult, BasicModel, ListResult, SelectOption } from 'app/shared/models';
import { Urls, HttpService } from 'app/shared/services';
import { TreeviewItem } from 'ngx-treeview';

@Injectable()
export class UserService implements BasicService<User>{
  getRoleOptions() {
    let url = Urls.platform.concat('/Roles/Application');
    return this.httpService.getList<SelectOption>(url, "type=0")
      .catch(error => Promise.reject(`获取角色信息失败： ${error}`));
  }
  getPositionOptions() {
    let url = Urls.chain.concat('/Departments/Options/Position');
    return this.httpService.getList<SelectOption>(url)
      .catch(error => Promise.reject(`获取部门信息失败： ${error}`));
  }
  resetPassword(id: string) {
    let url = Urls.platform.concat('/Users/ResetPassword/', id);
    return this.httpService.put(url, {})
      .catch(err => Promise.reject(`重置密码失败：${err}`));
  }
  enable(id: string, enabled: boolean) {
    let url = Urls.chain.concat('/SystemManager/Enabled/', id);
    return this.httpService.put(url, { enabled: enabled })
      .catch(err => Promise.reject(`${enabled ? "解冻" : "冻结"}操作失败：${err}`));
  }
  create(body: User): Promise<User> {
    let url = Urls.chain.concat('/SystemManager');
    return this.httpService.post<User>(url, body)
      .catch(error => Promise.reject(`新增用户失败：${error}`));
  }
  update(body: User): Promise<void> {
    let url = Urls.chain.concat('/SystemManager/EditUserInfo/', body.id);
    return this.httpService.put<void>(url, JSON.stringify(body))
      .then(result => result)
      .catch(error => Promise.reject(`编辑用户失败：${error}`));
  }
  patch(body: User): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getPagedList(params: UserSearchParams): Promise<PagedResult<User>> {
    let url = Urls.chain.concat('/SystemManager/Search');
    return this.httpService
      .getPagedList<User>(url, params)
      .catch(err => Promise.reject(`获取用户列表失败：${err}`));
  }
  get(id: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  constructor(private httpService: HttpService) { }

}

export class User extends BasicModel {
  public name: string;
  public phone: string;
  public createTime: string;
  public roles: Array<any>;
  public positions: Array<any>;
  public partPositionItems: Array<any>;
  public passWord: string;
}

export class UserSearchParams extends PagedParams {
  constructor(
    public keyWord?: string
  ) {
    super();
  }
}
