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
     * 分页获取客户列表信息
     * @param params
     */
    public getPagedList(params: PagedParams): Promise<PagedResult<any>> {
        const url = Urls.chain.concat('/Customers?', params.serialize());
        return this.httpService
            .get<PagedResult<any>>(url)
            .then(result => {
                console.log('客户列表数据', result);
                return result;
            })
            .catch(err => Promise.reject(`加载客户列表数据失败：${err}`));
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
            .catch(err => Promise.reject(`加载菜单失败：${err}`));
    }

    public update(body: any): Promise<void> {
        const url = Urls.chain.concat('/Customers/', body.id);
        return this.httpService.
            put<void>(url, body)
            .catch(err => Promise.reject(`更新菜单失败：${err}`));
    }

    public create(body: any): Promise<any> {
        const url = Urls.chain.concat('/Customers');
        return this.httpService
            .post<ApiResult<any>>(url, body)
            .then(m => m.data)
            .catch(err => Promise.reject(`添加工单失败：${err}`));
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
        public customerName?: string, // 车主
        public phone?: string, // 车主电话
        public startTimeDate?: string, // 建档开始时间
        public endTimeDate?: string, // 建档结束时间
    ) {
        super('CustomerListRequestParams');
    }
}