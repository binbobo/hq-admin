import { Injectable } from '@angular/core';
import { PagedResult, PagedParams, PagedService } from 'app/shared/models';
import { HttpService, Urls } from 'app/shared/services';

@Injectable()
export class PriceCheckService implements PagedService<PriceCheckListModel> {

  constructor(private httpService: HttpService) { }

  public getPagedList(params: PriceCheckListRequest): Promise<PagedResult<PriceCheckListModel>> {
    let url = Urls.chain.concat('/Products/GetProductPriceList');
    return this.httpService.getPagedList<PriceCheckListModel>(url, params)
      .catch(err => `获取列表失败：${err}`);
  }
}

export class PriceCheckListRequest extends PagedParams {
  constructor(
    public storeHouseId: string = "",
    public storageLocationName?: string,
    public code?: string,
    public name?: string,
    public vehicleName?: string,
    public categoryName?: string,
  ) {
    super()
  }
}

export class PriceCheckListModel {
  constructor(
    public number?: number,
    public storeHouseName?: string,
    public brand?: string,
    public code?: string,
    public name?: string,
    public count?: number,
    public vehicleName?: string,
    public category?: string,
    public price?: string,
  ) { }
}