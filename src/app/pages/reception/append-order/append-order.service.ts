import { Injectable } from '@angular/core';
import { HttpService, Urls } from "app/shared/services";
import { PagedParams, PagedResult, ApiResult } from "app/shared/models";
import { Observable } from "rxjs/Observable";

@Injectable()
export class AppendOrderService {

  constructor(private httpService: HttpService) {
  }

  // getAppendOrderParma(params: AppendOrderSearch):Observable<PagedResult<ReturnData>> {
  //   let url = Urls.chain.concat("/Maintenances/increase/search");
  //   return Observable.fromPromise(this.httpService.get<PagedResult<ReturnData>>(url, params.serialize()))
  // }

  //  根据工单或者车牌号搜索
  getAppendOrderParma(keyword: string): Observable<SearchReturnData[]> {
    const url = Urls.chain.concat('/Maintenances/increase/search');
    return this.httpService
      .request(url, {
        params: {
          'Keyword': keyword
        }
      })
      .map(response => {
        return response.json().data as SearchReturnData[];
      });
  }

  // 根据id查询(维修项目、附加项目、建议维修项)
  public get(id: string): Promise<DetailData> {
    const url = Urls.chain.concat('/Maintenances/', id);
    return this.httpService
      .get<ApiResult<DetailData>>(url)
      .then(result => result.data)
      .then(data => data || Promise.reject('获取数据无效！'))
      .catch(err => Promise.reject(`加载失败：${err}`));
  }

  // 新增维修项目及附加项目
  public post(body: MainItems): Promise<MainItems> {
    const url = Urls.chain.concat('/MaintenanceItemOutput/');
    return this.httpService
      .post<ApiResult<MainItems>>(url, body)
      .then(result => result.data)
      .catch(err => Promise.reject(`添加增项失败：${err}`));
  }


  // 新增建议维修项目



}


export class AppendOrderSearch extends PagedParams {
  public Keyword: string;
}

// 根据工单号或车牌号搜索创建的类
export class SearchReturnData {
  constructor(
    public id: string = '',//ID
    public plateNo: string = '', //车牌号 
    public phone: string = '',
    public customerName: string = '',
    public validate: string = '',//验车时间
    public createdOnUtc: string = '', //开单时间
    public contactUser: string = '',     //送修人
    public contactInfo: string = '',   //送修电话
    public createdUserName: string = '',   //服务顾问
    public brand: string = '',  //品牌
    public series: string = '',   //车系
    public model: string = '',   //车型
    public vin: string = '',  //VIN
    public typeName: string = '',   //维修类型
    public expectLeave: string = '',  //预计交车日期
    public mileage: number = 0, //行驶里程
    public lastEnterDate: string = '',//上次进店时间
    public nextDate: string = '',   //建议下次保养日期
    public location: string = '',   //维修工位
    public lastMileage: string = '', //上次进店里程
    public nextMileage: number = 0,   //建议下次保养里程    

  ) { }
}
// 根据名字查询维修项目

export class DetailData {
  constructor(
    public serviceOutputs: any = [],//维修项目
    public attachServiceOutputs: Array<any> = [],//附加项目
    public suggestServiceOutputs: any = [],//建议维修项
    public lastManufactureDetailOutput: any = [],//上次维修记录
    public feedBackInfosOutput: any = [],// 客户回访记录

  ) { }
}

//提交维修项目及附加项目
export class MainItems {
  constructor(
    public id: string,
    public maintenanceId: string, //维修工单（Maintenances表-Id字段） ,
    public itemId: string,//关联维修工项Id 返工单需要此字段 ,
    public serviceId: string,//维修项目（Services表-Id字段） ,
    public discount: any,// 折扣率 ,
    public serviceName: string,// 附加或维修项目名称 ,
    public type: string,//明细类型 1：维修项目2：附加项目,
    public workHour: any,//工时（维修项目） ,
    public price: any,// 金额（工时费或附加产品金额） 单位分 ,
    public amount: any, //工时*单价=总金额 单位分 ,
  ) { }
}


