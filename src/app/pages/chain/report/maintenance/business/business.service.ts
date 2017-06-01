import { Injectable } from '@angular/core';
import { HttpService, Urls } from "app/shared/services";
import { BasicService, PagedParams, PagedResult, ApiResult } from "app/shared/models";
import { Observable } from "rxjs/Observable";
import { TreeviewItem } from "ngx-treeview/lib";

@Injectable()
export class BusinessService implements BasicService<any> {

  constructor(private httpService: HttpService) { }

  get(id: string): Promise<any> {
    throw new Error('Method not implemented.');
  }
  create(body: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  update(body: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  patch(body: any): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  //页面加载时分页获取维修历史信息
  public getPagedList(params: BusinessListRequest): Promise<PagedResult<any>> {
    const url = Urls.chain.concat('/Maintenances/history/search?', params.serialize());
    return this.httpService.get<PagedResult<any>>(url)
      .then(result => {
        return result;
      })
      .catch(err => Promise.reject(`获取维修历史数据失败：${err}`));
  }

  //导出
  public export(params: BusinessListRequest): Promise<void> {
    const url = Urls.chain.concat('/Maintenances/history/ExportToExcel');
    return this.httpService
      .download(url, params.serialize())
      .catch(err => Promise.reject(`维修历史导出失败：${err}`));
  }

  //根据工单id获取维修历史详情
  public getDetails(id, orgItem): Promise<any> {
    let url;
    if (orgItem) {
      let arr = [];
      let orgItems = 'orgItems';
      orgItem.map(item => {
        arr.push(`${orgItems}=${item}`);
      });
      url = Urls.chain.concat('/Settlements/PrintDetail/', id, '?', arr.join('&'));
    } else {
      url = Urls.chain.concat('/Settlements/PrintDetail/', id);
    }
    return this.httpService
      .get<ApiResult<any>>(url)
      .then(result => result.data)
      .then(data => data || Promise.reject('获取详情无效'))
      .catch(err => Promise.reject(`获取详情数据失败：${err}`))
  }

  //获取服务顾问列表
  getEmployeesStores(): Observable<TreeviewItem[]> {
    const url = Urls.chain.concat('/Employees/GetByKey?key=SA');
    return this.httpService
      .request(url)
      .map(response => {
        let employeess = [];
        response.json().data.map((value) => {
          let obj = { text: value.name, value: value.id ,checked: false};
          employeess.push(new TreeviewItem(obj));
        })
        return employeess;
      });
  }

}
//请求参数
export class BusinessListRequest extends PagedParams {
  constructor(
    public plateNo?: string, // 车牌号
    public employees?: Array<string>, // 服务顾问ID
    public enterStartTimeDate?: string, // 进店开始时间
    public enterEndTimeDate?: string, // 进店结束时间
    public leaveStartTimeDate?: string, // 出厂开始时间
    public leaveEndTimeDate?: string, // 出厂结束时间
    public orgIds?: Array<string> // 查询范围
  ) {
    super();
  }
}

export class DetailsSearchRequest {
  constructor(
    public orgItems?: Array<string> // 
  ) { }
}