import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams, PagedResult, ApiResult, BasicService, ListResult, SelectOption } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class AssignService implements BasicService<any> {

    constructor(private httpService: HttpService) {
    }
    /**
     * 获取维修指派类型数据 用于维修指派
     * 
     * @returns {Observable<any[]>} 
     * 
     * @memberOf OrderService
     */
    getMaintenanceAssignTypes(): Observable<any[]> {
        const url = Urls.chain.concat('/DictValues/MaintainAssignType');
        return this.httpService
            .request(url)
            .map(response => {
                console.log('查询维修指派类型数据：', response.json().data);
                return response.json().data as any[];
            });
    }

    /**
     * 
     * 获取维修技师列表
     * 
     * @memberOf AssignService
     */
    getMaintenanceTechnicians(): Observable<any[]> {
        const url = Urls.chain.concat('/Employees/GetByKey');
        return this.httpService
            .request(url, {
                params: {
                    'key': 'ST'  // ST 代表维修技师
                }
            })
            .map(response => {
                console.log('查询维修技师列表数据：', response.json().data);
                return response.json().data as any[];
            });
    }


    /**
     * 分页获取工单列表信息
     * @param params
     */
    public getPagedList(params: PagedParams): Promise<PagedResult<any>> {
        const url = Urls.chain.concat('/MaintenanceTeams/assign/search?', params.serialize());
        return this.httpService
            .get<PagedResult<any>>(url)
            .then(result => {
                console.log('工单列表数据', result);
                return result;
            })
            .catch(err => Promise.reject(`加载工单列表失败：${err}`));
    }

    /**
     * 指派 转派工单
     * @param body 
     */
    public assignOrder(body: any): Promise<any> {
        const url = Urls.chain.concat('/MaintenanceTeams');
        return this.httpService
            .post<ApiResult<any>>(url, body)
            .catch(err => Promise.reject(`派工失败：${err}`));
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
        const url = Urls.chain.concat('/Maintenances/assign/', id);
        return this.httpService
            .get<ApiResult<any>>(url)
            .then(result => result.data)
            .then(data => data || Promise.reject('获取数据无效！'))
            .catch(err => Promise.reject(`获取工单详情数据失败：${err}`));
    }

    // 完工操作
    public update(body: any): Promise<void> {
        const url = Urls.chain.concat('/MaintenanceTeams/FinishedByMaintId/', body.id);
        return this.httpService.
            put<void>(url, body)
            .catch(err => Promise.reject(`执行完工操作失败：${err}`));
    }


    public create(body: any): Promise<any> {
        const url = Urls.chain.concat('/Maintenances');
        return this.httpService
            .post<ApiResult<any>>(url, body)
            .then(m => m.data)
            .catch(err => Promise.reject(`添加工单失败：${err}`));
    }

    patch(body: any): Promise<void> {
        throw new Error('Method not implemented.');
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

// 维修派工请求参数类
export class AssignListRequest extends PagedParams {
    constructor(
        // 工单列表页面查询参数
        public status?: Array<string>, // 工单状态
        public plateNo?: string, // 车牌号
        public billCode?: string, // 工单号
        public keyword?: string // 车牌号或者工单号
    ) {
        super();
    }
}
