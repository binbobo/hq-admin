import { Injectable } from '@angular/core';
import { HttpService, Urls } from "app/shared/services";
import { PagedParams, PagedResult, ApiResult, BasicService, BasicModel } from "app/shared/models";


@Injectable()
export class DistributeService implements BasicService<any>{
    get(id: string): Promise<any> {
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
    /**
    * 分页获取工单列表信息
    */
    public getPagedList(params: PagedParams): Promise<PagedResult<any>> {
        const url = Urls.chain.concat('/Maintenances?', params.serialize());
        return this.httpService
            .get<PagedResult<any>>(url)
            .then(result => {
                console.log('工单列表数据', result);
                return result;
            })
            .catch(err => Promise.reject(`列表失败：${err}`));
    }

}

export class DistributeRequest extends PagedParams {
    constructor(
        // 工单列表页面查询参数
        public keyword?: string, // 车牌号或者工单号
        public plateNo?: string,  //车牌号
        public billcode?: string, //工单号
    ) {
        super('DistributeRequestParams');
    }
}