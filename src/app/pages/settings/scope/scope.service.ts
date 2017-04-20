import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { BasicService, PagedParams, PagedResult, SelectOption } from 'app/shared/models';

@Injectable()
export class ScopeService implements BasicService<Scope>{

  constructor(private httpService: HttpService) { }

  getOptions(): Promise<Array<SelectOption>> {
    var params = new PagedParams(null, 1, 1000);
    return this.getPagedList(params)
      .then(result => result.data)
      .then(data => data || Promise.reject('无效的数据！'))
      .then(data => data.map(m => new SelectOption(m.name, m.id)));
  }

  getPagedList(params: PagedParams): Promise<PagedResult<Scope>> {
    let url = Urls.platform.concat('/scopes');
    return this.httpService.get<PagedResult<Scope>>(url)
      .catch(err => Promise.reject(`获取分组列表失败：${err}`));
  }
  get(id: string): Promise<Scope> {
    throw new Error('Method not implemented.');
  }
  create(body: Scope): Promise<Scope> {
    throw new Error('Method not implemented.');
  }
  update(body: Scope): Promise<void> {
    throw new Error('Method not implemented.');
  }
  patch(body: Scope): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export class Scope {
  constructor(
    public id?: string,
    public name?: string,
    public applicationId?: string,
  ) { }
}
