import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { SelectOption, ListResult } from 'app/shared/models';

@Injectable()
export class MountingsService {
    constructor(
        private httpService: HttpService
    ) { }

    public getWarehouseOptions(): Promise<Array<SelectOption>> {
        let url = Urls.chain.concat('storehouses?orgid=9f885937-c43b-484e-aba4-0aaf7039c2b2');
        return this.httpService.get<ListResult<any>>(url)
            .then(result => result.data)
            .then(data => data.map(m => new SelectOption(m.text, m.value)))
            .catch(err => Promise.reject(`获取仓库选项失败：${err}`));
    }
}