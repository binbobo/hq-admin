import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { SelectOption, ListResult, PagedResult, PagedParams, ApiResult } from 'app/shared/models';
import { DatePipe } from '@angular/common';

@Injectable()
export class SuspendedBillsService {
    constructor(
        private httpService: HttpService
    ) { }

    /**
     * 获取挂单列表
     */
    public getSuspendedBills<T>(type: string): Promise<PagedResult<T>> {
        let url = Urls.chain.concat('/SuspendedBills/GetAll?type=', type);
        return this.httpService.get<PagedResult<GetSuspendedBillItem>>(url)
            .then(result => {
                if (!Array.isArray(result.data)) {
                    return new PagedResult();
                } else {
                    let r = new PagedResult([], result.total, result.totalCount);
                    r.data = result.data.map(m => new SuspendedBillItem(m.id, this.getItem(m.data)));
                    return r;
                }
            })
            .catch(err => [])
    }

    private getItem<T>(data: string): T {
        if (!data) return null;
        try {
            return JSON.parse(data) as T;
        } catch (error) {
            return {} as T;
        }
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

class GetSuspendedBillItem {
    public id: string;
    public type: string;
    public data: string;
}

export class SuspendedBillItem<T> {
    constructor(
        public id?: string,
        public data?: T
    ) { }
}

export class GenerateSuspendedBillRequest {
    public suspendedBillId?: string
}

export class GenerateSuspendedBillResponse<T> extends ApiResult<T> {
    public id?: string;
    public type?: string;
}