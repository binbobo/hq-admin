import { Injectable } from '@angular/core';
import { PagedResult, PagedParams, BasicService } from 'app/shared/models';
import { HttpService, Urls } from 'app/shared/services';

@Injectable()
export class PriceCheckService implements BasicService<PriceCheckListModel> {

  constructor(private httpService: HttpService) { }

  get(id: string): Promise<PriceCheckListModel> {
    throw new Error('Method not implemented.');
  }
  create(body: PriceCheckListModel): Promise<PriceCheckListModel> {
    throw new Error('Method not implemented.');
  }
  update(body: PriceCheckListModel): Promise<void> {
    throw new Error('Method not implemented.');
  }
  patch(body: PriceCheckListModel): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public getPagedList(params: PriceCheckListRequest): Promise<PagedResult<PriceCheckListModel>> {
    let url = Urls.chain.concat('');
    return this.httpService.get<PagedResult<PriceCheckListModel>>(url)
      .then(result => result.nullCheck())
      .catch(err => `获取列表失败：${err}`);
  }
}

export class PriceCheckListRequest extends PagedParams {
  constructor(

  ) {
    super('PriceCheckListRequest')
  }
}

export class PriceCheckListModel {

}