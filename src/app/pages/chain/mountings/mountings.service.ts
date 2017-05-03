import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { SelectOption, ListResult } from 'app/shared/models';

@Injectable()
export class MountingsService {
    constructor(
        private httpService: HttpService
    ) { }

    /**
     * 获取仓库下拉选项
     */
    public getWarehouseOptions(): Promise<Array<SelectOption>> {
        let url = Urls.chain.concat('/storehouses?orgid=9f885937-c43b-484e-aba4-0aaf7039c2b2');
        return this.httpService.get<ListResult<any>>(url)
            .then(result => result.data)
            .then(data => data.map(m => new SelectOption(m.name, m.id)))
            .catch(err => Promise.reject(`获取仓库选项失败：${err}`));
    }

    /**
     * 根据仓库id获取库位选项
     * @param id 仓库id
     */
    public getLocationByHouseId(id: string): Promise<Array<SelectOption>> {
        let url = Urls.chain.concat('/storageLocations/getByHouseId?storeId=', id);
        return this.httpService.get<ListResult<any>>(url)
            .then(result => result.data)
            .then(data => data.map(m => new SelectOption(m.name, m.id)))
            .catch(err => Promise.reject(`获取库位选项失败：${err}`));
    }

}