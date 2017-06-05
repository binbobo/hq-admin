import { Injectable } from '@angular/core';
import { HttpService, Urls } from "app/shared/services";
import { PagedParams, PagedResult, ApiResult, BasicService } from "app/shared/models";
import { Observable } from "rxjs/Observable";

@Injectable()
export class AppendOrderService implements BasicService<any> {
  getPagedList(body: any): Promise<any> {
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

  constructor(private httpService: HttpService) {
  }

  //  根据工单或者车牌号搜索
  getAppendOrderParma(params: AppendItemSearchRequest): Promise<PagedResult<SearchReturnData>> {
    let search = params.serialize();
    const url = Urls.chain.concat('/Maintenances/increase/search');
    return this.httpService
      .get<PagedResult<SearchReturnData>>(url, search);
  }


  // 根据id查询(维修项目、附加项目、建议维修项)

  // 有分页的
  // public getPagedList(params: PagedParams): Promise<PagedResult<DetailData>> {
  //   const url = Urls.chain.concat('/Maintenances/', params.serialize());
  //   console.log(url)
  //   return this.httpService
  //     .get<PagedResult<DetailData>>(url)
  //     .then(result => {
  //       console.log('工单列表数据', result);
  //       return result;
  //     })
  //     .catch(err => Promise.reject(`加载工单列表失败：${err}`));
  // }


  public get(id: string): Promise<DetailData> {
    const url = Urls.chain.concat('/Maintenances/', id);
    return this.httpService
      .get<ApiResult<DetailData>>(url)
      .then(result => {
        return result.data
      })
      .catch(err => Promise.reject(`加载失败：${err}`));
  }
  //  增项 /Maintenances/increase/{id}

  public put(body: any, id: string): Promise<any> {
    const url = Urls.chain.concat('/Maintenances/increase/', id);
    return this.httpService
      .put<ApiResult<any>>(url, body)
      .catch(err => Promise.reject(`${err}`));
  }
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
    public id: any,
    public billCode: any,
    public serviceOutputs: any = [],//维修项目
    public attachServiceOutputs: Array<any> = [],//附加项目
    public suggestServiceOutputs: any = [],//建议维修项
    public lastManufactureDetailOutput: any = [],//上次维修记录
    public feedBackInfosOutput: any = [],// 客户回访记录
  ) { }
}
// export class AppendListData extends PagedParams {
//   constructor(
//     public id?: string
//   ) {
//     super('AppendListData');
//   }
// }

export class AppendItemSearchRequest extends PagedParams {
  constructor(
    public keyword?: string
  ) { super(); }
}
