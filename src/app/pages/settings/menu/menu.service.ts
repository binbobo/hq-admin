import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams, PagedResult, ApiResult, BasicModel, BasicService, ListResult, SelectOption } from 'app/shared/models';

@Injectable()
export class MenuService implements BasicService<Menu> {

    constructor(private httpService: HttpService) { }

    public getPagedList(params: PagedParams): Promise<PagedResult<Menu>> {
        let url = Urls.platform.concat('/navigations?', params.serialize());
        return this.httpService
            .get<PagedResult<Menu>>(url)
            .then(result => {
                result.data.forEach(m => {
                    let titles = this.getTitles(m);
                    m.title = titles.join('>');
                })
                return result;
            })
            .catch(err => Promise.reject(`加载菜单列表失败：${err}`));
    }

    private getTitles(menu: Menu, parents?: Array<string>): Array<string> {
        parents = parents || [];
        parents.unshift(menu.title)
        if (menu.parent) {
            return this.getTitles(menu.parent, parents);
        } else {
            return parents;
        }
    }

    public getSelectOptions(clientId?: string): Promise<Array<SelectOption>> {
        let url = Urls.platform.concat('/navigations/options?clientId=', clientId);
        return this.httpService
            .get<ListResult<SelectOption>>(url)
            .then(result => result.data)
            .then(data => data || Promise.reject('获取数据无效！'))
            .catch(err => Promise.reject(`菜单选项获取失败：${err}`));
    }

    public get(id: string): Promise<Menu> {
        let url = Urls.platform.concat('/navigations/', id);
        return this.httpService
            .get<ApiResult<Menu>>(url)
            .then(result => result.data)
            .then(data => data || Promise.reject('获取数据无效！'))
            .catch(err => Promise.reject(`加载菜单失败：${err}`));
    }

    public update(body: Menu): Promise<void> {
        let url = Urls.platform.concat('/navigations/', body.id);
        return this.httpService.
            put<void>(url, body)
            .catch(err => Promise.reject(`更新菜单失败：${err}`));
    }

    public create(body: Menu): Promise<Menu> {
        let url = Urls.platform.concat('/navigations');
        return this.httpService
            .post<ApiResult<Menu>>(url, body)
            .then(m => m.data)
            .catch(err => Promise.reject(`添加菜单失败：${err}`));
    }

    patch(body: Menu): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public delete(id: string): Promise<void> {
        let url = Urls.platform.concat('/navigations/', id);
        return this.httpService
            .delete(url)
            .catch(err => Promise.reject(`删除菜单失败：${err}`));
    }
}

export class MenuListRequest extends PagedParams {
    constructor(
        public clientId: string = "",
        public name?: string,
    ) {
        super('MenuListRequestParams');
    }
}

export class Menu extends BasicModel {
    constructor(
        public autoRun: boolean = false,
        public scopes: Array<string> = [],
        public parentId: string = '',
        public clientId: string = '',
        public title?: string,
        public path?: string,
        public icon?: string,
        public parent?: Menu,
    ) {
        super();
    }
}