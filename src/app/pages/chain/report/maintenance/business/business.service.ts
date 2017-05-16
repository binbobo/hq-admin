import { Injectable } from '@angular/core';
import { HttpService, Urls } from "app/shared/services";
import { BasicService, PagedParams, PagedResult, ApiResult } from "app/shared/models";

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
    console.log("url",url);
    return this.httpService.get<PagedResult<any>>(url)
      .then(result => {
        console.log('维修历史数据', result);
        return result;
      })
      .catch(err => Promise.reject(`获取维修历史数据失败：${err}`));
  }
  
  //导出
  public export(params: BusinessListRequest): Promise<void> {
    const url = Urls.chain.concat('/Maintenances/history/ExportToExcel');
    return this.httpService
      .download(url, params.serialize(), '维修历史')
      .catch(err => Promise.reject(`维修历史导出失败：${err}`));
  }
  //根据车牌号模糊查询结果
  getCustomerVehicleByPlateNo(params: FuzzySearchRequest): Promise<PagedResult<any>> {
    const search = params.serialize();
    const url = Urls.chain.concat('/CustomerVehicles/Search');
    // console.log('根据车牌号模糊查询客户车辆信息 响应数据', url, search);
    return this.httpService
      .get<PagedResult<any>>(url, search)
      .then(response => {
        // console.log('根据车牌号模糊查询客户车辆信息 响应数据', response);
        // 加工数据
        response.data = response.data.map(item => {
          const o = item;
          o.customerName = item.customerInfo.name;
          o.phone = item.customerInfo.phone;
          return o;
        });
        return response;
      });
  }

  //根据工单id获取详情
  public getBusinessDetail(id: string): Promise<any> {
    const url = Urls.chain.concat('/Settlements/PrintDetail/', id);
    return this.httpService
      .get<ApiResult<any>>(url)
      .then(result => result.data)
      .then(data => data || Promise.reject('获取详情无效'))
      .catch(err => Promise.reject(`获取详情数据失败：${err}`))

  }



}
//请求参数
export class BusinessListRequest extends PagedParams {
  constructor(
    public plateNo?: string, // 车牌号
    public enterStartTimeDate?: string, // 进店开始时间
    public enterEndTimeDate?: string, // 进店结束时间
    public leaveStartTimeDate?: string, // 出厂开始时间
    public leaveEndTimeDate?: string, // 出厂结束时间
    // public billCode?: string, // 工单号
    // public keyword?: string, // 关键字
    // public orgIds?: Array<string> // 查询范围
  ) {
    super();
  }
}

export class FuzzySearchRequest extends PagedParams {
  constructor(
    public keyword: string, // 模糊搜索关键字
  ) {
    super();
  }
}
