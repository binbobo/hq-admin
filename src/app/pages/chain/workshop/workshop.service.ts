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
   * 获取维修验收类型数据 用于维修指派
   * 
   * @returns {Observable<any[]>} 
   * 
   * @memberOf OrderService
   */
    getMaintenanceCheckTypes(): Observable<any[]> {
        const url = Urls.chain.concat('/DictValues/MaintainCheckedType');
        return this.httpService
            .request(url)
            .map(response => {
                return response.json().data as any[];
            });
    }

    /**
     * 分页获取工单列表信息
     * @param params
     */
    public getPagedList(params: PagedParams): Promise<PagedResult<any>> {
        const url = Urls.chain.concat('/MaintenanceTeams/Check/search?', params.serialize());
        // console.log('查询维修验收数据列表url: ', url);
        return this.httpService
            .get<PagedResult<any>>(url)
            .then(result => {
                return result;
            })
            .catch(err => Promise.reject(`加载维修验收工单列表失败：${err}`));
    }
    /**
    *  根据预检单id查询预检单信息
    * @param {string} id 
    * @returns Promise<any>
    * @memberOf OrderService
    */
    getPreCheckOrderInfoByPreCheckId(id: string): Promise<any> {
        const url = Urls.chain.concat('/PreChecks/', id);
        return this.httpService
            .get<ApiResult<any>>(url)
            .then(result => result.data)
            .then(data => data || Promise.reject('获取数据无效！'))
            .catch(err => Promise.reject(`获取预检单记录失败：${err}`));
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
        const url = Urls.chain.concat('/Maintenances/Check/', id);
        return this.httpService
            .get<ApiResult<any>>(url)
            .then(result => result.data)
            .then(data => data || Promise.reject('获取数据无效！')) 
            .catch(err => Promise.reject(`加载菜单失败：${err}`));
    }

    /**
     * 验收操作  同意
     * @param body
     */
    public update(body: any): Promise<void> {
        const url = Urls.chain.concat('/MaintenanceTeams/CheckedByItemIds');
        return this.httpService.
            put<void>(url, body)
            .catch(err => Promise.reject(`执行维修验收操作失败：${err}`));
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

// 维修派工请求参数类
export class WorkshopListRequest extends PagedParams {
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