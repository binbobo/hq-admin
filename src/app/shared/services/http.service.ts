import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { Request, Response, RequestOptionsArgs, URLSearchParams, Headers, RequestMethod, ResponseContentType, RequestOptions, Http } from '@angular/http';
import { UserService } from './user.service';
import * as fileSaver from 'file-saver';
import { ActivatedRoute } from '@angular/router';
import { ApiResult } from '../models/api-result';
import { Observable } from 'rxjs/Observable';
import { Urls } from './url.service';
import { PagedParams, PagedResult, ListResult } from 'app/shared/models';

@Injectable()
export class HttpService {

    constructor(
        private http: Http,
        private user: UserService,
    ) { }

    request(url: string, option?: RequestOptionsArgs): Observable<Response> {
        option = option || { method: RequestMethod.Get };
        return this.http.request(url, option);
    }

    promise(url: string, option?: RequestOptionsArgs): Promise<Response> {
        return this.request(url, option).toPromise();
    }

    get<TResult>(url: string, search?: string): Promise<TResult> {
        return this.promise(url, { method: RequestMethod.Get, search: search })
            .then(resp => this.extractData<TResult>(resp))
            .catch(resp => this.handleError(resp));
    }

    getPagedList<T>(url: string, params?: PagedParams): Promise<PagedResult<T>> {
        let search = params && params.serialize();
        return this.get<PagedResult<T>>(url, search)
            .then(result => result || new PagedResult());
    }

    getList<T>(url: string, search?: string): Promise<Array<T>> {
        return this.get<ListResult<T>>(url, search)
            .then(result => result || new ListResult([]))
            .then(result => Array.isArray(result.data) ? result.data : []);
    }

    getObject<T>(url: string, search?: string): Promise<T> {
        return this.get<ApiResult<T>>(url, search)
            .then(result => result.data);
    }

    post<TResult>(url: string, body: any): Promise<TResult> {
        return this.promise(url, { method: RequestMethod.Post, body: body })
            .then(resp => this.extractData<TResult>(resp))
            .catch(resp => this.handleError(resp));
    }

    put<TResult>(url: string, body: any): Promise<TResult> {
        return this.promise(url, { method: RequestMethod.Put, body: body })
            .then(resp => this.extractData<TResult>(resp))
            .catch(resp => this.handleError(resp));
    }

    patch<TResult>(url: string, body: any): Promise<TResult> {
        return this.promise(url, { method: RequestMethod.Patch, body: body })
            .then(resp => this.extractData<TResult>(resp))
            .catch(resp => this.handleError(resp));
    }

    delete(url: string): Promise<void> {
        return this.promise(url, { method: RequestMethod.Delete })
            .then(resp => Promise.resolve())
            .catch(resp => this.handleError(resp));
    }

    public download(url: string, search?: string, fileName?: string): Promise<void> {
        let option = new RequestOptions({
            search: search,
            responseType: ResponseContentType.Blob,
            method: RequestMethod.Get
        });
        return this.promise(url, option)
            .then(resp => {
                let data = resp.blob();
                let name = fileName || this.getFileName(resp);
                fileSaver.saveAs(data, name);
            })
            .catch(resp => this.handleError(resp))

    }

    private getFileName(response: Response) {
        let filename: string;
        let disposition = response.headers.get('Content-Disposition');
        if (disposition && ~disposition.indexOf('attachment')) {
            let array = disposition.split(';')
                .map(m => m.trim())
                .filter(m => m.includes('filename'))
            if (!array.length) return filename;
            filename = array.find(m => m.startsWith('filename*='));
            if (filename) {
                let index = filename.indexOf("''");
                if (~index) {
                    filename = filename.substr(index + 2);
                    filename = decodeURI(filename);
                } else {
                    filename = filename.substr('filename*='.length);
                }
            } else {
                filename = array.find(m => m.startsWith('filename='));
                filename = filename.substr('filename='.length);
            }
        }
        return filename;
    }

    public extractData<TResult>(res: Response): TResult {
        let text = res.text();
        if (!text) return;
        let data = res.json();
        if (!data) return;
        let result = data as TResult;
        if (!result) {
            throw new TypeError('返回对象类型转换失败！');
        }
        return result;
    }

    private handleError(error: Response | any) {
        console.error(error, 11);
        let errMsg: string = error.statusText;
        if (error instanceof Response) {
            if (error.status == 401) {
                this.refresh();
            } else if (error.status == 403) {
                errMsg = '请求没有权限！';
            } else if (error.status == 404) {
                errMsg = '没有找到请求的资源！';
            }
            else {
                errMsg = this.getErrors(error);
            }
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Promise.reject(errMsg);
    }

    public getErrors(response: Response) {
        let errMsg: string = response.statusText;
        try {
            let body = response.json() || '';
            if (body instanceof ProgressEvent) {
                errMsg = '服务端请求错误！'
            }
            else if (body && Object.keys(body).length) {
                errMsg = body.error || this.handleModelValidateError(body) || JSON.stringify(body);
            }
        } catch (error) {
            return errMsg;
        }
        return errMsg;
    }

    //.net模型验证返回结果处理
    private handleModelValidateError(errors: any) {
        let errorArr = [];
        for (var err in errors) {
            if (Array.isArray(errors[err])) {
                errorArr = errorArr.concat(errors[err]);
            }
        }
        return errorArr.join('');
    }

    private refresh() {
        let user = this.user.user;
        if (user && user.refreshToken) {
            let url = Urls.platform.concat('/Users/RefreshToken?refreshToken=', user.refreshToken);
            this.http.get(url)
                .toPromise()
                .then(resp => resp.json())
                .then(data => data || Promise.reject('无效的数据！'))
                .then(data => {
                    user.token = data.accessToken;
                    user.refreshToken = data.refreshToken;
                    this.user.onUserLogin.emit(user);
                })
                .catch(err => this.user.onUserLogout.emit());
        } else {
            this.user.onUserLogout.emit();
        }
    }
}


