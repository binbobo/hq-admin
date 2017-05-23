import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { SelectOption, ListResult, PagedResult, PagedParams } from 'app/shared/models';
import { DatePipe } from '@angular/common';

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

    /**
     * 获取单位下拉选项
     */
    public getUnitOptions() {
        let url = Urls.chain.concat('/DictValues/GetProductUnit');
        return this.httpService.get<ListResult<any>>(url)
            .then(result => result.data)
            .then(data => data.map(m => new SelectOption(m.value, m.id)))
            .catch(err => Promise.reject(`获取单位选项失败：${err}`));
    }

    /**
     * 获取配件分类下拉选项
     */
    public getCategoryOptions() {
        let url = Urls.chain.concat('/ProductCategories/GetAllCategory');
        return this.httpService.get<ListResult<any>>(url)
            .then(result => result.data)
            .then(data => data.map(m => new SelectOption(m.name, m.id)))
            .catch(err => Promise.reject(`获取分类选项失败：${err}`));
    }
}

export class GetMountingsListRequest extends PagedParams {
    constructor(
        public code?: string,
        public name?: string,
    ) {
        super();
    }
}
