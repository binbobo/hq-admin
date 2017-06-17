import { Injectable } from '@angular/core';
import { PagedService, PagedParams, PagedResult, SelectOption } from 'app/shared/models';
import { Urls, HttpService } from 'app/shared/services';
import * as moment from 'moment';

@Injectable()
export class TotalValueService implements PagedService<TotalValue> {

  getPagedList(params: TotalValueSearchParams): Promise<PagedResult<TotalValue>> {
    let url = Urls.chain.concat('/Maintenances/TotalValue');
    return this.httpService.getPagedList<TotalValue>(url, params)
      .catch(err => Promise.reject(`获取产值汇总信息失败：${err}`));
  }

  getNatureList() {
    let url = Urls.chain.concat('/DictValues/GetOrgNature');
    return this.httpService.getList<any>(url)
      .catch(err => Promise.reject(`获取门店性质列表失败：${err}`));
  }

  getStationTreeView(nature?: string): Promise<Array<any>> {
    nature = nature || '';
    const url = Urls.chain.concat('/Organizations/Nature?nature=', nature);
    return this.httpService.getObject(url)
      .then(data => [data])
      .catch(err => Promise.reject(`获取门店列表失败：${err}`));
  }

  export(params: TotalValueSearchParams): Promise<void> {
    return Promise.resolve();
  }

  constructor(private httpService: HttpService) { }

}

export class TotalValueResult extends PagedResult<any>{
  public vehicleCount: number;
  public averageProduction: number;
  public totalValue: number;
  public totalProductions: Array<TotalValueProduct>;
}

export class TotalValue {
  public date: string;
  public vchicleCount: number;
  public averageProduction: number;
  public productions: Array<TotalValueProduct>;
}

export class TotalValueProduct {
  public id: string;
  public nameColumn: string;
  public amount: number;
}

export class TotalValueSearchParams extends PagedParams {
  constructor(
    public startTimeDate?: string,
    public endTimeDate?: string,
    public orgIds?: Array<string>
  ) {
    super();
    // this.startTimeDate = startTimeDate || moment().subtract(30, 'd').format('YYYY-MM-DD');
    this.startTimeDate = startTimeDate || moment().format('YYYY-MM-DD');
    this.endTimeDate = endTimeDate || moment().format('YYYY-MM-DD');
  }

  serialize() {
    return super.serialize({
      endTimeDate: this.endTimeDate && this.endTimeDate + 'T23:59:59.999',
    });
  }
}
