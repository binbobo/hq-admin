import { Injectable } from '@angular/core';
import { HttpService, Urls } from "app/shared/services";
import { PagedParams, PagedResult, ApiResult, BasicService, BasicModel } from "app/shared/models";
import { Observable } from "rxjs/Observable";


@Injectable()
export class DistributeService implements BasicService<any>{
    get(body: any): Promise<any> {
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

    constructor(private httpService: HttpService) { }
    /**
    * 分页获取工单列表信息
    */
    public getPagedList(params: PagedParams): Promise<PagedResult<any>> {
        const url = Urls.chain.concat('/Maintenances?', params.serialize());
        return this.httpService
            .get<PagedResult<any>>(url)
            .then(result => {
                console.log('工单列表数据', result);
                return result;
            })
            .catch(err => Promise.reject(`列表失败：${err}`));
    }
    //  根据工单或者车牌号搜索
    getOrderPageData(params: DistributeRequest): Promise<PagedResult<SearchReturnData>> {
        let search = params.serialize();
        const url = Urls.chain.concat('/Maintenances');
        return this.httpService
            .get<PagedResult<SearchReturnData>>(url, search)
    }

    // 根据id获取工单详情
    public getOrderItemData(id: string): Promise<DetailData> {
        const url = Urls.chain.concat('/Maintenances/', id);
        return this.httpService
            .get<ApiResult<DetailData>>(url)
            .then(result => {
                return result.data
            })
            .then(data => data || Promise.reject('获取数据无效！'))
            .catch(err => Promise.reject(`加载失败：${err}`));
    }

    // 根据配件编码或配件名称搜索编码列表 
    getProductList(params: ProductRequest): Promise<PagedResult<ProductsParams>> {
        let search = params.serialize();
        const url = Urls.chain.concat('/products/getListByNameOrCode');
        return this.httpService
            .get<PagedResult<ProductsParams>>(url, search)
    }

    //生成维修发料单
    public postBill(body: any): Promise<any> {
        const url = Urls.chain.concat('/StoreInOutDetails/CreateMaintBill');
        return this.httpService
            .post<ApiResult<any>>(url, body)
            .catch(err => Promise.reject(`${err}`));
    }

    // 维修发料打印接口 StoreInOutDetails/PrintStore

    getPrintList(billId: string,billCode: string,SerialNums:any): Observable<any> {
        const url = Urls.chain.concat('/StoreInOutDetails/PrintStore');
        return this.httpService
            .request(url, {
                params: {
                    "billId": billId,
                    "billCode":billCode,
                    "SerialNums":SerialNums
                }
            })
            .map(response => {
                return response.json().data as any[];
            });
    }

    // 维修发料获取已发料list数据 /StoreInOutDetails/GetMainList

    // public getMainList(id: string): Promise<any> {
    //     const url = Urls.chain.concat('/StoreInOutDetails/GetMainList?BillId=' + id, "&&BillTypeKey=MM");
    //     return this.httpService
    //         .get<ApiResult<any>>(url)
    //         .then(result => {
    //             console.log(result.data)
    //             return result.data
    //         })
    //         .then(data => data || Promise.reject('获取数据无效！'))
    //         .catch(err => Promise.reject(`加载失败：${err}`));
    // }

    getMainList(billCode: string): Observable<any> {
        const url = Urls.chain.concat('/StoreInOutDetails/GetMainList');
        return this.httpService
            .request(url, {
                params: {
                    "BillCode": billCode,
                    "BillTypeKey": "MM"
                }
            })
            .map(response => {
                return response.json().data as any[];
            });
    }
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

export class DistributeRequest extends PagedParams {
    constructor(
        // 工单列表页面查询参数
        public keyword?: string, // 车牌号或者工单号
        public plateNo?: string,  //车牌号
        public billcode?: string, //工单号
    ) {
        super('DistributeRequestParams');
    }
}

export class ProductRequest extends PagedParams {
    constructor(
        public code?: string,
        public name?: string,
    ) {
        super()
    }
}



export class ProductsParams extends PagedParams {
    constructor(
        public storeHouseName: string,//仓库名称
        public storageLocationName: string,//库位名称
        public specification: string,//规格型号
        public vehicleName: string,//车型
        public price: string,//单价
        public amount: string,//金额
        public brand: string,//品牌
        public number: any//序号
    ) {
        super();
    }
}
export class DetailData {
    constructor(
        public id: any,
        public billCode: any,
        public serviceOutputs: any = [],//维修项目
        public attachServiceOutputs: Array<any> = [],//附加项目
        public suggestServiceOutputs: any = [],//建议维修项
        public lastManufactureDetailOutput: any = [],//上次维修记录
        public feedBackInfosOutput: any = [],// 客户回访记录
        public productOutputs: any = [],//维修配件
        public maintenanceEmployees: any = []//领料人列表
    ) { }
}
export class DistributeListItem {
    constructor(
        public count: number = 0,
        public price: number = 0,
        public amount: number = 0,
        public stockCount: number = 0,
        public productName?: string,
        public brand?: string,
        public productId?: string,
        public productCode?: string,
        public productSpecification?: string,
        public storeId?: string,
        public locationId?: string,
        public description?: string,
        public locationName?: string,
        public houseName?: string,
        public vihicleName?: string,
        public serviceName?: string,
        public createUser?: string,
        public createUserName?: string,
        public maintenanceItemId?: string,
        public number?: any
    ) { }
}