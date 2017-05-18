import { PagedResult } from './api-result';
import { PagedParams } from './request-params';

export interface BasicService<T> extends PagedService<T>, DetailService<T>, DeleteService {
    create(body: T): Promise<T>;
    update(body: T): Promise<void>;
    patch(body: T): Promise<void>;
}

export interface PagedService<T> {
    getPagedList(params: PagedParams): Promise<PagedResult<T>>;
}

export interface DetailService<T> {
    get(id: string): Promise<T>;
}

export interface DeleteService {
    delete(id: string): Promise<void>;
}