import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams, PagedResult, ApiResult, BasicModel, BasicService, ListResult, SelectOption } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class CustomerService implements BasicService<any> {


    constructor(private httpService: HttpService) {
    }

    patch(body: any): Promise<void> {
        throw new Error('Method not implemented.');
    }

    /**
    * 获取维修类型数据
    * @memberOf OrderService
    */
    getProvincesData(): Observable<any[]> {
        const url = Urls.location.concat('Areas/provinces');
        return this.httpService
            .request(url)
            .map(response => {
                // console.log('查询省份数据：', response.json().data);
                return response.json().data as any[];
            });
    }

    /**
     * 根据省份id获取其下面的城市列表
     * 或者根据城市id获取其下面的区县列表
     * @memberOf OrderService
     */
    getChildrenData(parentId: string): Observable<any[]> {
        const url = Urls.location.concat('Areas/' + parentId + '/children');
        return this.httpService
            .request(url)
            .map(response => {
                // console.log('查询城市或者区县数据：', response.json().data);
                return response.json().data as any[];
            });
    }


    /**
     * 分页获取客户列表信息
     * @param params
     */
    public getPagedList(params: CustomerListRequest): Promise<PagedResult<any>> {
        const url = Urls.chain.concat('/Customers?', params.serialize());
        console.log('查询客户车主列表数据url: ', url);
        return this.httpService
            .get<PagedResult<any>>(url)
            .then(result => {
                console.log('客户列表数据', result);
                return result;
            })
            .catch(err => Promise.reject(`加载客户列表数据失败：${err}`));
    }

    /**
     * 到处车主信息
     * @param {PagedParams} params 
     * @returns {Promise<any>} 
     * 
     * @memberOf CustomerService
     */
    public export(params: CustomerListRequest): Promise<void> {
        const url = Urls.chain.concat('/Customers/ExportToExcel');
        console.log('导出客户列表参数以及url：', params.serialize(), url);
        return this.httpService
            .download(url, params.serialize(), '客户列表')
            .catch(err => Promise.reject(`客户列表导出失败：${err}`));
    }

    /**
     * 根据工单id查询工单详细信息
     * 
     * @param {string} id 
     * @returns {Promise<Order>} 
     * 
     * @memberOf OrderService
     */
    public get(id: string): Promise<any> {
        const url = Urls.chain.concat('/Customers/', id);
        return this.httpService
            .get<ApiResult<any>>(url)
            .then(result => result.data)
            .then(data => data || Promise.reject('获取数据无效！'))
            .catch(err => Promise.reject(`获取客户详情失败：${err}`));
    }

    /**
     * 
     * @param body 更新车主信息
     */
    public update(body: any): Promise<void> {
        const url = Urls.chain.concat('/Customers/Vehicle/', body.id);
        console.log('更新车主信息亲求url: ', url);
        return this.httpService.
            put<void>(url, body)
            .catch(err => Promise.reject(`更新车主失败失败：${err}`));
    }

    /**
 * 根据车主姓名或者电话模糊查询其它门店车主信息
 * @param {string} token
 * @returns {Observable<Vehicle[]>}
 * @memberOf OrderService
 */
    getVehicleByNameOrPhone(token: string, type: string): Observable<any[]> {
        const url = Urls.chain.concat('/Customers/search');

        const params: any = {};
        if (type === 'name') {
            params.name = token;
        } else if (type === 'phone') {
            params.phone = token;
        }
        console.log('根据车主或者手机号模糊查询其它门店的车主信息:', token);
        return this.httpService
            .request(url, {
                params: params
            })
            .map(response => {
                console.log('根据车主或者手机号模糊查询其它门店的车主信息：', response.json().data);
                return response.json().data as any[];
            });
    }

    /**
   * 根据车型模糊查询车辆信息
   * @param {string} token
   * @returns {Observable<Vehicle[]>}
   * @memberOf OrderService
   */
    getVehicleByBrand(brandName: string): Observable<any[]> {
        const url = Urls.chain.concat('/Brands/search');
        console.log('根据品牌模糊查询车辆信息brandName:', brandName);
        return this.httpService
            .request(url, {
                params: {
                    'brandName': brandName
                }
            })
            .map(response => {
                console.log('根据品牌模糊查询车辆信息：', response.json().data);
                return response.json().data as any[];
            });
    }
    /**
     * 根据车型模糊查询车辆信息
     * @param {string} token
     * @returns {Observable<Vehicle[]>}
     * @memberOf OrderService
     */
    getVehicleBySerias(serieName: string, brandId: string): Observable<any[]> {
        const url = Urls.chain.concat('/VehicleSeries/search');
        return this.httpService
            .request(url, {
                params: {
                    'serieName': serieName,
                    'brandId': brandId
                }
            })
            .map(response => {
                console.log('根据车系模糊查询车辆信息：', response.json().data);
                return response.json().data as any[];
            });
    }

    /**
   * 根据车型模糊查询车辆信息
   * @param {string} token
   * @returns {Observable<Vehicle[]>}
   * @memberOf OrderService
   */
    getVehicleByModel(vehicleName: string, brandId: string, seriesId: string): Observable<any[]> {
        const url = Urls.chain.concat('/Vehicles/search');
        // console.log('根据车型模糊查询车辆信息参数', vehicleName, brandId, seriesId);
        return this.httpService
            .request(url, {
                params: {
                    'vehicleName': vehicleName,
                    'brandId': brandId,
                    'seriesId': seriesId
                }
            })
            .map(response => {
                console.log('根据车型模糊查询车辆信息：', response.json().data);
                return response.json().data as any[];
            });
    }

    /**
     * 创建车主
     * @param body 
     */
    public create(body: any): Promise<any> {
        const url = Urls.chain.concat('/Customers/Vehicle');
        return this.httpService
            .post<ApiResult<any>>(url, body)
            .then(m => m.data)
            .catch(err => Promise.reject(`添加车主失败：${err}`));
    }

    /**
     * 根据工单Id, 删除一条工单记录 作废
     * @param {string} id 
     * @returns {Promise<void>} 
     * 
     * @memberOf OrderService
     */
    public delete(id: string): Promise<void> {
        const url = Urls.chain.concat('/Customers/', id);
        return this.httpService
            .delete(url)
            .catch(err => Promise.reject(`删除工单失败：${err}`));
    }
}

// 维修派工请求参数类
export class CustomerListRequest extends PagedParams {
    constructor(
        public plateNo?: string, // 车牌号
        public name?: string, // 车主
        public phone?: string, // 车主电话
        public createdStartDate?: string, // 建档开始时间
        public createdEndDate?: string, // 建档结束时间
    ) {
        super('CustomerListRequestParams');
    }
}