import { Injectable } from '@angular/core';
import { Urls, HttpService } from "app/shared/services";
import { ApiResult } from 'app/shared/models';

@Injectable()
export class ChainService {

    constructor(private httpService: HttpService) { }

    //获取结算方式
    public getSettlementType(): Promise<Array<any>> {
        const url = Urls.chain.concat('/DictValues/SaleEttlementMethod');
        return this.httpService.getList(url)
            .catch(err => Promise.reject(`获取结算方式类型失败：${err}`))
    }

}