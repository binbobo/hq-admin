export class ApiResult<T>{
    constructor(public data: T) { }
}

export class ListResult<T> implements ApiResult<Array<T>>{
    constructor(public data: Array<T>) { }
}

export class PagedResult<T> implements ApiResult<Array<T>>{
    constructor(
        public data: Array<T>,
        public total: number,
        public totalCount: number
    ) { }

    public nullCheck(): PagedResult<T> {
        this.data = this.data || [];
        this.total = this.total || 0;
        this.totalCount = this.totalCount || 0;
        return this;
    }
}

export class SuccessResult implements ApiResult<boolean>{
    constructor(public data: boolean) { }
}

export class ContentResult<T>{
    constructor(public content: T) { }
}