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
                console.log(response.json().data);
                return response.json().data as MaintenanceType[];
            });
    }

    /**
     * 获取维修类型数据
     * @memberOf OrderService
     */
    getMaintenanceItemsByName(name: string): Observable<MaintenanceItem[]> {
        console.log(name);
        const url = Urls.chain.concat('/Services/GetByName');
        return this.httpService
            .request(url, {
                params: {
                    name: name
                }
            })
            .map(response => {
                console.log(response.json().data);
                return response.json().data as MaintenanceItem[];
            });
    }

    /**
     * 根据车牌号模糊查询客户车辆信息
     * @param {string} token
     * @returns {Observable<CustomerVehicle[]>}
     * @memberOf OrderService
     */
    getCustomerVehicleByPlateNo(token: string): Observable<CustomerVehicle[]> {
        const url = Urls.chain.concat('/CustomerVehicles/GetByPlateNo');
        return this.httpService
            .request(url, {
                params: {
                    'plateNo': token
                }
            })
            .map(response => {
                console.log(response.json().data);
                return response.json().data as CustomerVehicle[];
            });
    }

      /**
     * 根据车牌号模糊查询客户车辆信息
     * @param {string} token
     * @returns {Observable<CustomerVehicle[]>}
     * @memberOf OrderService
     */
    getCustomerVehicleByCustomerName(token: string): Observable<CustomerVehicle[]> {
        const url = Urls.chain.concat('/Customers/GetByName');
        return this.httpService
            .request(url, {
                params: {
                    'name': token
                }
            })
            .map(response => {
                console.log(response.json().data);
                return response.json().data as CustomerVehicle[];
            });
    }

    /**
     * 获取可以选择的门店，用于中查询范围下拉框
     * @memberOf OrderService
     */
    getSelectableStores(): TreeviewItem[] {
        const beijingStores = new TreeviewItem({
            text: '北京店',
            value: 9
        });
        const neimengStores = new TreeviewItem({
            text: '内蒙总店',
            value: 9,
            children: [{
                text: '包头店', value: 91
            }]
        });
        const shanghaiStores = new TreeviewItem({
            text: '上海店',
            value: 9
        });

        return [beijingStores, shanghaiStores, neimengStores];
    }

    public getPagedList(params: PagedParams): Promise<PagedResult<Order>> {
        const url = Urls.chain.concat('/Maintenances?', params.serialize());
        return this.httpService
            .get<PagedResult<Order>>(url)
            .then(result => {
                result.data.forEach(m => {
                });
                return result;
            })
            .catch(err => Promise.reject(`加载工单列表失败：${err}`));
    }

    public get(id: string): Promise<Order> {
        const url = Urls.chain.concat('/order/', id);
        return this.httpService
            .get<ApiResult<Order>>(url)
            .then(result => result.data)
            .then(data => data || Promise.reject('获取数据无效！'))
            .catch(err => Promise.reject(`加载菜单失败：${err}`));
    }

    public update(body: Order): Promise<void> {
        const url = Urls.chain.concat('/order/', body.id);
        return this.httpService.
            put<void>(url, body)
            .catch(err => Promise.reject(`更新菜单失败：${err}`));
    }

    public create(body: Order): Promise<Order> {
        const url = Urls.chain.concat('/order');
        return this.httpService
            .post<ApiResult<Order>>(url, body)
            .then(m => m.data)
            .catch(err => Promise.reject(`添加工单失败：${err}`));
    }

    patch(body: Order): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public delete(id: string): Promise<void> {
        const url = Urls.chain.concat('/order/', id);
        return this.httpService
            .delete(url)
            .catch(err => Promise.reject(`删除工单失败：${err}`));
    }
}

// 工单请求参数类
export class OrderListRequest extends PagedParams {
    constructor(
        // 工单列表页面查询参数
        status?: string, // 工单状态
        plateNo?: string, // 车牌号
        customerName?: string, // 车主
        phone?: string, // 车主电话
        contactUser?: string, // 送修人
        contactInfo?: string, // 送修人电话
        brand?: string, // 品牌
        series?: string, // 车系
        model?: string, // 车型
        billCode?: string, // 工单号
        createdUserName?: string, // 服务顾问
        type?: string, // 维修类型
        createdOnUtc?: string, // 进店时间
        leaveTime?: string // 出厂时间
    ) {
        super('OrderListRequestParams');
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

// 客户车辆关系model类
export class CustomerVehicle {
    constructor(
        public plateNo: string = '', // 车牌号
        public customerName: string = '', // 车主
        public phone: string = '', // 车主电话
        public series: string = '', // 车系
        public model: string = '', // 车型
        public brand: string = '', // 品牌
        public mileage: string = '', // 行驶里程
        public purchaseDate: Date = null, // 购车时间
        public vin: string = '', // vin, 车辆唯一编码
    ) {
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
