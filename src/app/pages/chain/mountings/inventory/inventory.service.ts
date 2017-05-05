import { Injectable, Injector } from '@angular/core';
import { BasicService, BasicModel, PagedParams, PagedResult, ApiResult } from 'app/shared/models';
import { HttpService, Urls } from 'app/shared/services';

@Injectable()
export class InventoryService implements BasicService<Inventory> {

  getPagedList(params: InventoryListRequest): Promise<PagedResult<Inventory>> {
    let search = params.serialize();
    let url = Urls.chain.concat('/products/getproductlist?', search);
    return this.httpService.get<PagedResult<Inventory>>(url)
      .catch(err => Promise.reject(`获取配件列表失败：${err}`));
  }
  get(id: string): Promise<Inventory> {
    let url = Urls.chain.concat('/Products/', id);
    return this.httpService.get<ApiResult<Inventory>>(url)
      .then(result => result.data)
      .catch(err => `获取配件详情信息失败：${err}`);
  }
  create(body: Inventory): Promise<Inventory> {
    let url = Urls.chain.concat('/Products');
    return this.httpService.post<ApiResult<Inventory>>(url, body)
      .then(result => result.data)
      .catch(err => Promise.reject(`配件添加失败：${err}`));
  }
  update(body: Inventory): Promise<void> {
    let url = Urls.chain.concat('/Products');
    return this.httpService.put<void>(url, body)
      .catch(err => Promise.reject(`配件修改失败：${err}`));
  }
  patch(body: Inventory): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  export(params: InventoryListRequest): Promise<void> {
    let url = Urls.chain.concat('/Products/ExportToExcel');
    let search = params.serialize();
    return this.httpService.download(url, search)
      .catch(err => Promise.reject(`库存列表导出失败：${err}`));
  }

  enable(ids: Array<string>): Promise<void> {
    let params = new EnableRequest(ids);
    let url = Urls.chain.concat('/Products/SetEnable');
    return this.httpService.put<void>(url, params)
      .catch(err => Promise.reject(`库存状态更新失败：${err}`));
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
    public categoryId: Array<string> = [],
    public number?: number,
    public storeId?: string,
    public locationName?: string,
    public storageLocationName?: string,
    public category?: string,
    public brand?: string,
    public brandId?: string,
    public brandName?: string,
    public code?: string,
    public name?: string,
    public count?: string,
    public vehicleName?: string,
    public unit?: string,
    public price?: string,
    public newPrice?: string,
    public packageInfo?: string,
    public madeIn?: string,
    public properties?: Array<string>,
    public description?: string,
    public inCount?: string,
    public outCount?: string,
    public maxCount?: string,
    public minCount?: string
  ) {
    super();
  }
}

export class EnableRequest {
  constructor(
    public ids: Array<string>
  ) {
  }
}