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
    * 获取省份数据
    * @memberOf OrderService
    */
    getProvincesData(): Observable<any[]> {
        const url = Urls.location.concat('Areas/provinces');
        return this.httpService
            .request(url)
            .map(response => {
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
                return response.json().data as any[];
            });
    }


    /**
     * 分页获取客户列表信息
     * @param params
     */
    public getPagedList(params: CustomerListRequest): Promise<PagedResult<any>> {
        const url = Urls.chain.concat('/Customers?', params.serialize());
        return this.httpService
            .get<PagedResult<any>>(url)
            .then(result => {
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
        return this.httpService
            .download(url, params.serialize())
            .catch(err => Promise.reject(`客户列表导出失败：${err}`));
    }

    /**
     * 根据车主id查询车主详细信息
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
        return this.httpService.
            put<void>(url, body)
            .catch(err => Promise.reject(`更新车主失败：${err}`));
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
            .catch(err => Promise.reject(`删除客户记录失败：${err}`));
    }

    /**
     * 获取来源渠道数据
     * @memberOf OrderService
     */
    public getCustomerSource(): Observable<any[]> {
        const url = Urls.chain.concat('/CustomerSources');
        return this.httpService
            .request(url)
            .map(response => {
                return response.json().data;
            });
    }
}

// 维修派工请求参数类
export class CustomerListRequest extends PagedParams {
    constructor(
        public source?: string, // 来源渠道
        public name?: string, // 车主
        public phone?: string, // 车主电话
        public createdStartDate?: string, // 建档开始时间
        public createdEndDate?: string, // 建档结束时间
    ) {
        super();
    }
}
