import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams, PagedResult, ApiResult, BasicModel, BasicService, ListResult, SelectOption } from 'app/shared/models';
import { TreeviewItem } from 'ngx-treeview';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class WorkshopService implements BasicService<any> {


    constructor(private httpService: HttpService) {
    }

    patch(body: any): Promise<void> {
        throw new Error('Method not implemented.');
    }

    /**
     * 分页获取工单列表信息
     * @param params
     */
    public getPagedList(params: PagedParams): Promise<PagedResult<any>> {
        const url = Urls.chain.concat('/Maintenances?', params.serialize());
        return this.httpService
            .get<PagedResult<any>>(url)
            .then(result => {
                console.log('工单列表数据', result);
                return result;
            })
            .catch(err => Promise.reject(`加载工单列表失败：${err}`));
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
        const url = Urls.chain.concat('/Maintenances/', id);
        return this.httpService
            .get<ApiResult<any>>(url)
            .then(result => result.data)
            .then(data => data || Promise.reject('获取数据无效！'))
            .catch(err => Promise.reject(`加载菜单失败：${err}`));
    }

    public update(body: any): Promise<void> {
        const url = Urls.chain.concat('/order/', body.id);
        return this.httpService.
            put<void>(url, body)
            .catch(err => Promise.reject(`更新菜单失败：${err}`));
    }

    public create(body: any): Promise<any> {
        const url = Urls.chain.concat('/Maintenances');
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
        const url = Urls.chain.concat('/Maintenances/', id);
        return this.httpService
            .delete(url)
            .catch(err => Promise.reject(`删除工单失败：${err}`));
    }
}

// 工单请求参数类
export class WorkshopListRequest extends PagedParams {
    constructor(
        // 工单列表页面查询参数
        public states?: Array<string>, // 工单状态
        public plateNo?: string, // 车牌号
        public customerName?: string, // 车主
        public phone?: string, // 车主电话
        public contactUser?: string, // 送修人
        public contactInfo?: string, // 送修人电话
        public brand?: string, // 品牌
        public series?: string, // 车系
        public model?: string, // 车型
        public billCode?: string, // 工单号
        public createdUserName?: string, // 服务顾问
        public type?: string, // 维修类型
        public enterStartTimeDate?: string, // 进店开始时间
        public enterEndTimeDate?: string, // 进店结束时间
        public leaveStartTimeDate?: string, // 出厂开始时间
        public leaveEndTimeDate?: string, // 出厂结束时间
        public orgIds?: Array<string> // 查询范围
    ) {
        super('WorkshopListRequestParams');
    }
}
