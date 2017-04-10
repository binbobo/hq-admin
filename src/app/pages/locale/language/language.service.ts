import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams, PagedResult, ApiResult, ListResult, BasicService, BasicModel } from 'app/shared/models';

@Injectable()
export class LanguageService implements BasicService<Language> {

    constructor(private httpService: HttpService) { }

    public getPagedList(params: LanguageListRequest): Promise<PagedResult<Language>> {
        let url = Urls.localization.concat('/languages?', params.serialize());
        return this.httpService
            .get<PagedResult<Language>>(url)
            .catch(err => Promise.reject(`语言列表加载失败：${err}`));
    }

    public get(id: string): Promise<Language> {
        let url = Urls.localization.concat('/languages/', id);
        return this.httpService
            .get<ApiResult<Language>>(url)
            .then(result => result.data);
    }

    public update(body: Language): Promise<void> {
        let url = Urls.localization.concat('/languages/', body.id);
        return this.httpService
            .put<void>(url, body)
            .catch(err => Promise.reject(`语言编辑失败：${err}`));
    }

    public create(body: Language): Promise<Language> {
        let url = Urls.localization.concat('/languages');
        return this.httpService
            .post<ApiResult<Language>>(url, body)
            .then(resp => resp.data)
            .catch(err => Promise.reject(`语言添加失败：${err}`));
    }

    public patch(body: Language): Promise<void> {
        throw new Error('Method not implemented.');
    }

    public delete(id: string): Promise<void> {
        let url = Urls.localization.concat('/languages/', id);
        return this.httpService
            .delete(url)
            .catch(err => Promise.reject(`语言删除失败${err}`));
    }

    public getAvailableList(enabled?: boolean): Promise<Array<Language>> {
        let url = Urls.localization.concat(`/languages/available?enabled=${enabled===undefined?'':enabled}`);
        return this.httpService
            .get<ListResult<Language>>(url)
            .then(result => result.data)
            .catch(err => Promise.reject(`获取语言列表失败${err}`));
    }
}

export class LanguageListRequest extends PagedParams {
    constructor(
        public enabled: boolean | string = "",
        public name?: string,
        public code?: string,
    ) { super('LanguageListRequestParams') }
}

export class Language extends BasicModel {
    constructor(
        public name?: string,
        public flag?: string,
        public code?: string,
        public culture?: string,
        public rtl?: boolean
    ) { super(); }
}