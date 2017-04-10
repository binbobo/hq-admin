import { PagedResult } from './api-result';
import { PagedParams } from './request-params';

export interface BasicService<T> {
    getPagedList(params: PagedParams): Promise<PagedResult<T>>;
    get(id: string): Promise<T>;
    create(body: T): Promise<T>;
    update(body: T): Promise<void>;
    patch(body: T): Promise<void>;
    delete(id: string): Promise<void>;
}