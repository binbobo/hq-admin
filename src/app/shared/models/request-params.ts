export abstract class RequestParams {
    public serialize(): string {
        let self = this;
        return Object.keys(this)
            .filter(key => key !== "keyName")
            .map(function (key) {
                if (self[key] === '' || self[key] === null || self[key] === undefined) return null;
                return key + "=" + self[key];
            })
            .filter(m => m != null)
            .join('&');
    }

    private keyName: string;

    constructor(keyName?: string) {
        this.keyName = keyName;
    }

    public init(): void {
        if (!this.keyName) return;
        let key = `RequestParams.${this.keyName}`;
        let value = sessionStorage.getItem(key);
        if (!value) return;
        let obj = JSON.parse(value);
        Object.assign(this, obj);
    }

    public save(): void {
        if (!this.keyName) return;
        let key = `RequestParams.${this.keyName}`;
        let obj = Object.create(null);
        Object.assign(obj, this);
        obj.keyName = undefined;
        let value = JSON.stringify(obj);
        sessionStorage.setItem(key, value);
    }
}

export class PagedParams extends RequestParams {

    public pageIndex = 1;
    public pageSize = 10;

    constructor(keyName?: string, pageIndex?: number, pageSize?: number) {
        super(keyName);
        this.pageIndex = pageIndex || this.pageIndex;
        this.pageSize = pageSize || this.pageSize;
    }

    public setPage(index: number, size?: number) {
        this.pageIndex = index;
        this.pageSize = size || this.pageSize;
    }
}