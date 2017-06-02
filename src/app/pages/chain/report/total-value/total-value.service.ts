import { Injectable } from '@angular/core';
import { PagedService, PagedParams, PagedResult, SelectOption } from 'app/shared/models';
import { TreeviewItem } from 'ngx-treeview/lib';
import { Urls, HttpService } from 'app/shared/services';
import * as moment from 'moment';

@Injectable()
export class TotalValueService implements PagedService<TotalValue> {

  getPagedList(params: PagedParams): Promise<PagedResult<TotalValue>> {
    throw new Error("Method not implemented.");
  }

  getStationTreeView(): Promise<Array<TreeviewItem>> {
    const url = Urls.chain.concat('/Organizations');
    return this.httpService.getObject(url)
      .then(data => [data].concat({name:'测试店铺',id:'1'},{name:'测试店铺1',id:'2'},{name:'测试店铺2',id:'3'},))
      .then(arr => this.convertToTreeView(arr))
      .catch(err => Promise.reject(`获取门店列表失败：${err}`));
  }

  convertToTreeView(options: Array<any>): Array<TreeviewItem> {
    if (!Array.isArray(options) || !options.length) return null;
    return options.filter(m => m).map(m => {
      let item = new TreeviewItem({ value: m.id, text: m.name, checked: false });
      item.children = this.convertToTreeView(m['children']);
      return item;
    });
  }

  export(params: TotalValueSearchParams): Promise<void> {
    return Promise.resolve();
  }

  constructor(private httpService: HttpService) { }

}

export class TotalValue {

}

export class TotalValueSearchParams extends PagedParams {
  constructor(
    public startTime?: string,
    public endTime?: string,
    public stations?: Array<string>
  ) {
    super();
    this.startTime = startTime || moment().subtract(30, 'd').format('YYYY-MM-DD');
    this.endTime = endTime || moment().format('YYYY-MM-DD');
  }
}
