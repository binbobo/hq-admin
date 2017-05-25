import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams, PagedResult, ApiResult, BasicModel, BasicService, ListResult, SelectOption } from 'app/shared/models';
import { TreeviewItem } from 'ngx-treeview';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class OrderService implements BasicService<Order> {

    constructor(private httpService: HttpService) {
    }

    /**
     * 获取维修类型数据
     * @memberOf OrderService
     */
    getMaintenanceTypes(): Observable<MaintenanceType[]> {
        const url = Urls.chain.concat('/DictValues/GetOrderType');
        return this.httpService
            .request(url)
            .map(response => {
                // console.log('查询维修类型数据：', response.json().data);
                return response.json().data as MaintenanceType[];
            });
    }

    /**
    * 获取工单状态数据  用于工单列表条件过滤
    * @memberOf OrderService
    */
    getOrderStatus(): Observable<any[]> {
        const url = Urls.chain.concat('/DictValues/MaintenanceStateType');
        return this.httpService
            .request(url)
            .map(response => {
                console.log('查询工单状态数据：', response.json().data);
                return response.json().data as any[];
            });
    }

    /**
 * 到处车主信息
 * @param {PagedParams} params 
 * @returns {Promise<any>} 
 * 
 * @memberOf CustomerService
 */
    public export(params: OrderListRequest): Promise<void> {
        const url = Urls.chain.concat('/Maintenances/ExportToExcel');
        console.log('导出工单列表参数以及url：', params.serialize(), url);
        return this.httpService
            .download(url, params.serialize(), '工单列表')
            .catch(err => Promise.reject(`工单列表导出失败：${err}`));
    }

    /**
  * 根据车系模糊查询车辆信息
  * 
  * @param {FuzzySearchRequest} params 
  * @returns {Promise<PagedResult<any>>} 
  * 
  * @memberof OrderService
  */
    getVehicleBySeries(params: VehicleSeriesSearchRequest): Promise<PagedResult<any>> {
        const search = params.serialize();
        const url = Urls.chain.concat('/VehicleSeries/search');
        console.log('根据车系模糊查询车辆信息:', url + search);
        return this.httpService
            .get<PagedResult<any>>(url, search);
    }
    /**
  * 根据维修项目名称模糊查询维修项目信息
  * 
  * @param {FuzzySearchRequest} params 
  * @returns {Promise<PagedResult<any>>} 
  * 
  * @memberof OrderService
  */
    getMaintenanceItemsByName(params: FuzzySearchRequest): Promise<PagedResult<any>> {
        const search = params.serialize();
        const url = Urls.chain.concat('/Services/GetByName');
        console.log('模糊查询维修项目:', url + search);
        return this.httpService
            .get<PagedResult<any>>(url, search);
    }

    /**
* 添加维修项目
* 
* @memberof OrderService
*/
    createMaintenanceItem(body: any): Promise<any> {
        const url = Urls.chain.concat('/Services');
        return this.httpService
            .post<ApiResult<Order>>(url, body)
            .then(m => m.data)
            .catch(err => Promise.reject(`添加维修工项失败：${err}`));
    }
    /**
  * 根据车型模糊查询车辆信息
  * 
  * @param {FuzzySearchRequest} params 
  * @returns {Promise<PagedResult<any>>} 
  * 
  * @memberof OrderService
  */
    getVehicleByModel(params: VehicleSearchRequest): Promise<PagedResult<any>> {
        const search = params.serialize();
        const url = Urls.chain.concat('/Vehicles/search');
        console.log('根据车型模糊查询车辆信息:', url + search);
        return this.httpService
            .get<PagedResult<any>>(url, search);
    }

    /**
  *  根据客户车辆id查询上一次工单信息
  * @param {string} id 
  * @returns Promise<any>
  * @memberOf OrderService
  */
    getLastOrderInfo(id: string): Promise<any> {
        const url = Urls.chain.concat('/Maintenances/search/last/', id);
        return this.httpService
            .get<ApiResult<any>>(url)
            .then(result => result.data)
            .then(data => data || Promise.reject('获取数据无效！'))
            .catch(err => Promise.reject(`获取上次工单记录失败：${err}`));
    }

    /**
 *  获取可以选择的门店，用于中查询范围下拉框
 * @param {string} id 
 * @returns Observable<TreeviewItem[]>
 * @memberOf OrderService
 */
    getSelectableStores(): Observable<TreeviewItem[]> {
        const url = Urls.chain.concat('/Organizations');
        return this.httpService
            .request(url)
            .map(response => {
                console.log('获取可以选择的门店：', response);
                console.log('获取可以选择的门店，用于查询范围下拉框：', response.json().data);
                let orgs = null;
                if (this.orgsRecursion([response.json().data])) {
                    orgs = <any>this.orgsRecursion([response.json().data])[0];
                    console.log('test:', orgs)
                }
                console.log('orgs:',orgs);
                // 每个车主下面可能有多个车辆信息
                return [new TreeviewItem(orgs)];
            });
    }

    // 递归组织(门店)树结构
    private orgsRecursion(orgsArr: Array<any>) {
        if (!orgsArr) {
            return null;
        };
        return orgsArr.map((value, index, array) => {
            // 导航节点
            const obj = { text: value.name, value: null };
            // 如果有子组织, 递归遍历
            if (value.children && value.children.length > 0) {
                 // 如果有孩子  将父节点组织到孩子节点中  放到前头
                value.children = [{
                    name: value.name + '总店',
                    id: value.id
                }].concat(value.children);
                obj['children'] = this.orgsRecursion(value.children);
            } else {
                // 如果没有孩子  直接返回
                obj.value = value.id;
            }
            console.log('obj:',obj);
            return obj;
        });
    }

    /**
     * 分页获取工单列表信息
     * @param params
     */
    public getPagedList(params: OrderListRequest): Promise<PagedResult<Order>> {
        const url = Urls.chain.concat('/Maintenances?', params.serialize());
        return this.httpService
            .get<PagedResult<Order>>(url)
            .then(result => {
                console.log('工单列表数据', result);
                return result;
            })
            .catch(err => Promise.reject(`列表失败：${err}`));
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
        const url = Urls.chain.concat('/Maintenances/Detail/', id);
        return this.httpService
            .get<ApiResult<any>>(url)
            .then(result => result.data)
            .then(data => data || Promise.reject('获取数据无效！'))
            .catch(err => Promise.reject(`获取工单详情数据失败：${err}`));
    }

    public update(body: Order): Promise<void> {
        const url = Urls.chain.concat('/order/', body.id);
        return this.httpService.
            put<void>(url, body)
            .catch(err => Promise.reject(`更新菜单失败：${err}`));
    }

    /**
     * 创建工单服务
     * @param body 
     */
    public create(body: Order): Promise<Order> {
        const url = Urls.chain.concat('/Maintenances');
        return this.httpService
            .post<ApiResult<Order>>(url, body)
            .then(m => m.data)
            .catch(err => Promise.reject(`添加工单失败：${err}`));
    }

    patch(body: Order): Promise<void> {
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

// 工单请求参数类
export class OrderListRequest extends PagedParams {
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
        public vehicleName?: string, // 车型
        public billCode?: string, // 工单号
        public createdUserName?: string, // 服务顾问
        public type?: string, // 维修类型
        public enterStartTimeDate?: string, // 进店开始时间
        public enterEndTimeDate?: string, // 进店结束时间
        public leaveStartTimeDate?: string, // 出厂开始时间
        public leaveEndTimeDate?: string, // 出厂结束时间
        public orgIds?: Array<string> // 查询范围
    ) {
        // super('OrderListRequestParams');
        super(); // 不带参数  禁用缓存
    }
}

export class FuzzySearchRequest extends PagedParams {
    constructor(
        public keyword: string, // 模糊搜索关键字
    ) {
        // super('FuzzySearchRequestParams');
        super();
    }
}

export class VehicleSeriesSearchRequest extends PagedParams {
    constructor(
        public seriesName?: string, // 车系名称
        public brandId?: string, // 品牌id
    ) {
        super();
    }
}
export class VehicleSearchRequest extends PagedParams {
    constructor(
        public vehicleName?: string, // 车型名称
        public brandId?: string, // 品牌id
        public seriesId?: string, // 车系id
    ) {
        super();
    }
}

// 工单model类
export class Order extends BasicModel {
    constructor(
        public orgName: string, // 店名
        public status: string, // 状态
        public type: string, // 维修类型
        public billCode: string, // 工单号
        // 进店时间 / 开单时间  使用父类的createdOnUtc字段
        public expectLeave: Date, // 预计交车时间
        public overTime: number, // 超时(时间)
        public createdUserName: string, // 服务顾问
        public brand: string, // 品牌
        public series: string, // 车系
        public model: string, // 车型
        public validate: Date, // 验车日期
        public plateNo: string, // 车牌号
        public mileage: string, // 行驶里程
        public purchaseDate: Date, // 购车时间
        public vin: string, // vin, 车辆唯一编码
        public customerName: string, // 车主
        public phone: string, // 车主电话
        public contactUser: string, // 送修人
        public contactInfo: string, // 送修人电话
        public introducer: string, // 介绍人
        public introPhone: string, // 介绍人电话
        public employeeNames: string, // 维修技师
        public leaveTime: string, // 出厂时间
        public location: string, // 维修工位
        public lastEnter: Date, // 上次进店时间
        public lastMileage: number, // 上次进店里程
        public nextDate: Date, // 建议下次保养日期
        public nextMileage: number, // 建议下次保养里程
    ) {
        super();
    }
}

// 车辆model类
export class Vehicle {
    constructor(
        public series: string, // 车系
        public model: string, // 车型
        public brand: string, // 品牌
    ) {
    }
}

// 维修项目model类
export class MaintenanceItem {
    constructor(
        id: string, // 主键
        name: string, // 名称
        shortName: string, // 简称,
        firstChar: string, // 首字母,
        bopomofo: string,  // 拼音,
        shortBopomofo: string  // 简拼,
    ) {
    }
}

// 维修类型model类
export class MaintenanceType {
    constructor(
        public id: string, // id
        public value: string, // 名称
    ) {
    }
}

// 增项页面根据工单号或者车牌号搜索工单
export class AppendOrderSearch {
    constructor(
        public plateNo: string = '', // 车牌号
        public customerName: string = '', // 车主
        public phone: string = '', // 车主电话
        public series: string = '', // 车系
        public model: string = '', // 车型
        public brand: string = '', // 品牌
    ) { }
}
