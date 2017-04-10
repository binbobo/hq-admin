import { Injectable } from '@angular/core';
import { HttpService, Urls } from 'app/shared/services';
import { ListResult, ApiResult } from "app/shared/models";

@Injectable()
export class ConfigService {

    constructor(private httpService: HttpService) { }

    private formatPath(path: string) {
        if (!path) return "__";
        return path.replace(/\/+/g, "__");
    }

    loadChildNode(path: string): Promise<Array<string>> {
        path = this.formatPath(path);
        let url = Urls.configuration.concat(`/configurations/${path}/children`);
        return this.httpService
            .get<ListResult<string>>(url)
            .then(resp => resp.data)
            .catch(err => Promise.reject(`加载配置子节点失败：${err})`));
    }

    getValue(path: string): Promise<string> {
        path = this.formatPath(path);
        let url = Urls.configuration.concat(`/configurations/${path}`);
        return this.httpService
            .get<ApiResult<string>>(url)
            .then(resp => resp.data)
            .catch(err => Promise.reject(`获取配置值失败：${err}`));
    }

    setValue(path: string, value: string): Promise<void> {
        let body = { value: value };
        path = this.formatPath(path);
        let url = Urls.configuration.concat(`/configurations/${path}`);
        return this.httpService
            .put<void>(url, body)
            .catch(err => Promise.reject(`配置保存失败：${err}`));
    }

    createPath(path: string, value?: string): Promise<any> {
        let body = { path: this.formatPath(path), value: value };
        let url = Urls.configuration.concat('/configurations');
        return this.httpService
            .post<ApiResult<any>>(url, body)
            .catch(err => Promise.reject(`配置添加失败：${err}`));
    }

    deletePath(path: string): Promise<void> {
        path = this.formatPath(path);
        let url = Urls.configuration.concat(`/configurations/${path}`);
        return this.httpService.delete(url)
            .catch(err => Promise.reject(`配置删除失败：${err}`));
    }
}