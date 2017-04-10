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
}

export class SuccessResult implements ApiResult<boolean>{
    constructor(public data: boolean) { }
}

export class ContentResult<T>{
    constructor(public content: T) { }
}