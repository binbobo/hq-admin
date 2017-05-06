import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { SelectOption, ListResult, PagedResult, PagedParams } from 'app/shared/models';
import { DatePipe } from '@angular/common';

@Injectable()
export class SuspendedBillsService {
    constructor(
        private httpService: HttpService
    ) { }

    /**
     * 获取挂单列表
     */
    public getSuspendedBills(type: string): Promise<any> {
        let url = Urls.chain.concat('/SuspendedBills/Get');
        return this.httpService.get<ListResult<any>>(url)
            .then(result => result.data)
            .catch(err => [])
    }

    /**
     * 挂单
     */
    public suspend(data: object, type: string): Promise<void> {
        let body = { type: type, data: JSON.stringify(data) };
        let url = Urls.chain.concat('/SuspendedBills');
        return this.httpService.post<void>(url, body)
            .catch(err => Promise.reject(`挂单操作失败：${err}`));
    }
}
