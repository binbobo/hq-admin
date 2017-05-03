import { Injectable, Injector } from '@angular/core';
import { BasicService, BasicModel, PagedParams, PagedResult } from 'app/shared/models';
import { HttpService, Urls } from 'app/shared/services';

@Injectable()
export class InventoryService implements BasicService<Inventory> {

  getPagedList(params: PagedParams): Promise<PagedResult<Inventory>> {
    let search = params.serialize();
    let url = Urls.chain.concat('/products/getproductlist?', search);
    return this.httpService.get<PagedResult<Inventory>>(url)
      .catch(err => Promise.reject(`获取配件列表失败：${err}`));
  }
  get(id: string): Promise<Inventory> {
    throw new Error('Method not implemented.');
  }
  create(body: Inventory): Promise<Inventory> {
    throw new Error('Method not implemented.');
  }
  update(body: Inventory): Promise<void> {
    throw new Error('Method not implemented.');
  }
  patch(body: Inventory): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  constructor(
    private httpService: HttpService,
  ) { }

}


export class InventoryListRequest extends PagedParams {
  constructor(
    public storehouseId: string = '',
    public storageLocationName?: string,
    public categoryName?: string,
    public code?: string,
    public name?: string,
    public vehicleName?: string,
  ) {
    super('InventoryListRequest');
  }
}

export class Inventory extends BasicModel {
  constructor(
    public storageLocationName?: string,
    public category?: string,
    public code?: string,
    public name?: string,
    public count?: string,
    public vehicleName?: string,
    public unit?: string,
    public price?: string,
    public inCount?: string,
    public outCount?: string,
    public maxCount?: string,
    public minCount?: string
  ) {
    super();
  }
}