import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { BasicService, PagedParams, PagedResult, ApiResult, BasicModel } from 'app/shared/models';

@Injectable()
export class WarehouseService implements BasicService<Warehouse> {
  create(body: Warehouse): Promise<Warehouse> {
    let url = Urls.chain.concat('/StoreHouses');
    return this.httpService.post<ApiResult<Warehouse>>(url, body)
      .then(result => result.data)
      .catch(err => Promise.reject(`添加仓库失败：${err}`));
  }
  update(body: Warehouse): Promise<void> {
    throw new Error("Method not implemented.");
  }
  patch(body: Warehouse): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getPagedList(params: PagedParams): Promise<PagedResult<Warehouse>> {
    let url = Urls.chain.concat('/StoreHouses/GetPageList');
    let search = params.serialize();
    return this.httpService.get<PagedResult<Warehouse>>(url, search)
      .then(result => result || new PagedResult())
      .catch(err => Promise.reject(`获取仓库列表失败：${err}`));
  }
  get(id: string): Promise<Warehouse> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  constructor(private httpService: HttpService) { }

}

export class Warehouse extends BasicModel {
  constructor(
    public code?: string,
    public name?: string,
  ) {
    super();
  }
}


export class WarehouseSearchParams extends PagedParams {
  constructor(
    public code?: string,
    public name?: string,
  ) {
    super();
  }
}