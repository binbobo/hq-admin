import { Injectable } from '@angular/core';
import { Urls, HttpService } from "app/shared/services";
import { ApiResult, BasicService, PagedParams, PagedResult } from 'app/shared/models';
import { Observable } from "rxjs/Observable";
import * as moment from 'moment';

@Injectable()
export class SaleCheckService implements BasicService<any>{
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

    // 获取收银列表
    public getPagedList(params: PagedParams): Promise<PagedResult<OrderListSearch>> {
        const url = Urls.chain.concat('/Settlements/SalesSummaryBills?', params.serialize());
        return this.httpService
            .get<PagedResult<OrderListSearch>>(url)
            .then(result => {
                return result;
            })
            .catch(err => Promise.reject(`加载工单列表失败：${err}`));
    }
    // 获取收银查询状态
    public getOrderStatus(): Observable<any[]> {
        const url = Urls.chain.concat('/DictValues/SummarySearchType');
        return this.httpService
            .request(url)
            .map(response => {
                return response.json().data as any[];
            });
    }
    // 获取支付方式的ID 
    public getPayType(): Promise<any> {
        const url = Urls.chain.concat('/DictValues/PlayType');
        return this.httpService
            .get<ApiResult<any>>(url)
            .then(result => {
                return result.data
            })
            .catch(err => Promise.reject(`获取支付方式id数据失败：${err}`))
    }
    // 提交收银接口
    public postPay(body: any, id: any): Promise<any> {
        const url = Urls.chain.concat('/CheckOuts/Sale/', id);
        return this.httpService
            .post<void>(url, body)
            .catch(err => Promise.reject(`${err}`));
    }
    //    根据id获取详情
    public getSaleDetail(id: string): Promise<any> {
        const url = Urls.chain.concat('/Settlements/SaleDetails/', id);
        return this.httpService
            .get<ApiResult<any>>(url)
            .then(result => result.data)
            .then(data => data || Promise.reject('获取详情无效'))
            .catch(err => Promise.reject(`获取失败：${err}`))

    }
}

// 工单请求参数类
export class OrderListSearch extends PagedParams {
    constructor(
        // 工单列表页面查询参数
        public statekey?: any, // 工单状态
        public carnumber?: string, // 车牌号
        public phone?: any,//手机号码
        public customername?: string,//客户名称
        public billcode?: string, // 工单号
        public starttime?: string, // 销售开始时间
        public endtime?: string, // 销售结束时间
        public settlementid?: any,//结算方式
        public settlementcode?: any//结算单号
    ) {
        super();
        // this.starttime = starttime || moment().subtract(30, 'd').format('YYYY-MM-DD');
        // this.endtime = endtime || moment().endOf('day').format('YYYY-MM-DD HH:mm');
    }
}