import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams, PagedResult, ApiResult, BasicModel, BasicService, ListResult, SelectOption } from 'app/shared/models';
import { TreeviewItem } from 'ng2-dropdown-treeview';


@Injectable()
export class OrderService implements BasicService<Order> {

    constructor(private httpService: HttpService) { }

    /**
     * 获取可以选择的门店，用于中查询范围下拉框
     * @memberOf OrderService
     */
    getSelectableStores(): TreeviewItem[]  {
        const beijingStores = new TreeviewItem({
            text: '北京店',
            value: 9
        });
        const neimengStores = new TreeviewItem({
            text: '内蒙总店',
            value: 9,
            children: [ {
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
        const url = Urls.configuration.concat('/order?', params.serialize());
        return Promise.resolve({
            data: [{
                storeName: '总店', // 店名
                status: '维修中', // 状态
                type: '一般维修', // 维修类型
                orderNo: '313523532523', // 工单号
                enterTime: '2017-4-15 11:35:22', // 进店时间
                predictedTime: '2017-4-16 11:35:22', // 预计交车时间
                outeOfDate: '否', // 超时(期)
                serviceConsultant: 'gaofei', // 服务顾问
                brand: '奥迪', // 品牌
                carType: '', // 车型
                plateNumber: '京A324P', // 车牌号
                mileage: '100公里', // 行驶里程
                buyTime: '2013-4-15', // 购车时间
                carOwner: 'xxx', // 车主
                sender: '凡凡', // 送修人
                senderPhoneNumber: '13699117904', // 送修人电话
                introducer: 'gaofei', // 介绍人
                introducerPhoneNumber: '13923421346', // 介绍人电话
                repairTechnician: '高飞', // 维修技师
                leaveFactoryTime: '2017-4-16 11:35:22' // 出厂时间
            },{
                storeName: '总店', // 店名
                status: '维修中', // 状态
                type: '一般维修', // 维修类型
                orderNo: '313523532523', // 工单号
                enterTime: '2017-4-15 11:35:22', // 进店时间
                predictedTime: '2017-4-16 11:35:22', // 预计交车时间
                outeOfDate: '否', // 超时(期)
                serviceConsultant: 'gaofei', // 服务顾问
                brand: '奥迪', // 品牌
                carType: '', // 车型
                plateNumber: '京A324P', // 车牌号
                mileage: '100公里', // 行驶里程
                buyTime: '2013-4-15', // 购车时间
                carOwner: 'xxx', // 车主
                sender: 'fanfan', // 送修人
                senderPhoneNumber: '13699117904', // 送修人电话
                introducer: 'gaofei', // 介绍人
                introducerPhoneNumber: '13923421346', // 介绍人电话
                repairTechnician: '', // 维修技师
                leaveFactoryTime: '2017-4-16 11:35:22' // 出厂时间
            }],
            total: 1,
            totalCount: 1
        }).then(result => {
            return result;
        }).catch(err => Promise.reject(`加载工单列表失败：${err}`));
        // return this.httpService
        //     .get<PagedResult<Order>>(url)
        //     .then(result => {
        //         result.data.forEach(m => {
        //         });
        //         return result;
        //     })
        //     .catch(err => Promise.reject(`加载工单列表失败：${err}`));
    }

    public get(id: string): Promise<Order> {
        const url = Urls.configuration.concat('/order/', id);
        return this.httpService
            .get<ApiResult<Order>>(url)
            .then(result => result.data)
            .then(data => data || Promise.reject('获取数据无效！'))
            .catch(err => Promise.reject(`加载菜单失败：${err}`));
    }

    public update(body: Order): Promise<void> {
        const url = Urls.configuration.concat('/order/', body.id);
        return this.httpService.
            put<void>(url, body)
            .catch(err => Promise.reject(`更新菜单失败：${err}`));
    }

    public create(body: Order): Promise<Order> {
        const url = Urls.configuration.concat('/order');
        return this.httpService
            .post<ApiResult<Order>>(url, body)
            .then(m => m.data)
            .catch(err => Promise.reject(`添加工单失败：${err}`));
    }

    patch(body: Order): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public delete(id: string): Promise<void> {
        const url = Urls.configuration.concat('/order/', id);
        return this.httpService
            .delete(url)
            .catch(err => Promise.reject(`删除工单失败：${err}`));
    }
}

// 工单请求参数类
export class OrderListRequest extends PagedParams {
    constructor(
        title?: string
    ) {
        super('OrderListRequestParams');
    }
}

// 工单model类
export class Order extends BasicModel {
    constructor(
        public storeName: string, // 店名
        public status: string, // 状态
        public type: string, // 维修类型
        public orderNo: string, // 工单号
        public enterTime: string, // 进店时间
        public predictedTime: string, // 预计交车时间
        public outeOfDate: string, // 超时(期)
        public serviceConsultant: string, // 服务顾问
        public brand: string, // 品牌
        public carType: string, // 车型
        public plateNumber: string, // 车牌号
        public mileage: string, // 行驶里程
        public buyTime: string, // 购车时间
        public carOwner: string, // 车主
        public sender: string, // 送修人
        public senderPhoneNumber: string, // 送修人电话
        public introducer: string, // 介绍人
        public introducerPhoneNumber: string, // 介绍人电话
        public repairTechnician: string, // 维修技师
        public leaveFactoryTime: string // 出厂时间
    ) {
        super();
    }
}
