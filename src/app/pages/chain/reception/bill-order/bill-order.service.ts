import { Injectable } from '@angular/core';
import { Urls, HttpService } from "app/shared/services";
import { ApiResult, BasicService, PagedParams, PagedResult } from 'app/shared/models';
import { Observable } from "rxjs/Observable";

@Injectable()
export class BillOrderService implements BasicService<any>{

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
  constructor(private httpService: HttpService) { }

  // 工单详情
  public get(id: string): Promise<any> {
    const url = Urls.chain.concat('/Maintenances/', id);
    return this.httpService
      .get<ApiResult<any>>(url)
      .then(result => result.data)
      .then(data => data || Promise.reject('获取数据无效！'))
      .catch(err => Promise.reject(`获取工单详情数据失败：${err}`));
  }
  // 获取维修结算列表
  public getPagedList(params: PagedParams): Promise<PagedResult<OrderListSearch>> {
    const url = Urls.chain.concat('/Settlements?', params.serialize());
    return this.httpService
      .get<PagedResult<OrderListSearch>>(url)
      .then(result => {
        console.log('工单列表数据', result);
        return result;
      })
      .catch(err => Promise.reject(`加载工单列表失败：${err}`));
  }

  // 获取维修结算查询状态
  public getOrderStatus(): Observable<any[]> {
    const url = Urls.chain.concat('/DictValues/SettlementSearchType');
    return this.httpService
      .request(url)
      .map(response => {
        return response.json().data as any[];
      });
  }
  // 根据id查询工单的材料费和工时费用
  public getCost(id: string): Promise<any> {
    const url = Urls.chain.concat('/Settlements/MaintenanceCost/', id);
    return this.httpService
      .get<ApiResult<any>>(url)
      .then(result => result.data)
      .then(data => data || Promise.reject('获取费用数据无效'))
      .catch(err => Promise.reject(`获取费用数据失败：${err}`))
  }

  // 生成结算单
  public post(body: any, id: any): Promise<any> {
    const url = Urls.chain.concat('/Settlements/MaintenanceBill/', id);
    return this.httpService
      .post<void>(url, body)
      .catch(err => Promise.reject(`${err}`));
  }

  // 撤销结算单
  public put(id: string): Promise<void> {
    const url = Urls.chain.concat('/Settlements/UnMaintenanceBill/', id);
    return this.httpService.
      put<void>(url, {})
      .catch(err => Promise.reject(`更新菜单失败：${err}`));
  }
  //根据工单id获取打印详情
  public getPrintDetail(id: string): Promise<any> {
    const url = Urls.chain.concat('/Settlements/PrintDetail/', id);
    return this.httpService
      .get<ApiResult<any>>(url)
      .then(result => result.data)
      .then(data => data || Promise.reject('获取打印数据无效'))
      .catch(err => Promise.reject(`获取打印数据失败：${err}`))

  }

}

// 工单请求参数类
export class OrderListSearch extends PagedParams {
  constructor(
    // 工单列表页面查询参数
    public statekey?: any, // 工单状态
    public carnumber?: string, // 车牌号
    public billcode?: string, // 工单号
    public starttime?: string, // 进店开始时间
    public endtime?: string, // 进店结束时间
  ) {
    super('OrderListSearchParams');
  }
}