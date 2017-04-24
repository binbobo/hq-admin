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



// 新增建议维修项目



}


export class AppendOrderSearch extends PagedParams {
  public Keyword: string;
}

// 根据工单号或车牌号搜索创建的类
export class SearchReturnData {
  constructor(
    public id:string='',//ID
    public plateNo: string = '', //车牌号 
    public phone: string = '',
    public customerName: string = '',
    public validate: string = '',//验车时间
    public createdOnUtc:string='', //开单时间
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
    public lastEnterDate:string='',//上次进店时间
    public nextDate: string = '',   //建议下次保养日期
    public location: string = '',   //维修工位
    public lastMileage:string='', //上次进店里程
    public nextMileage: number = 0,   //建议下次保养里程    

  ) {}
}
// 根据名字查询维修项目

export class DetailData{
    constructor(
       public serviceOutputs:any=[],//维修项目
       public attachServiceOutputs:any=[],//附加项目
        public suggestServiceOutputs:any=[],//建议维修项
        public lastManufactureDetailOutput:any=[],//上次维修记录
        public feedBackInfosOutput:any=[],// 客户回访记录
       
    ){  }
}



