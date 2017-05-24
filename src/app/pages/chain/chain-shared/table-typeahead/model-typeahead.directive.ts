import { Directive, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams } from 'app/shared/models';

@Directive({
    selector: '[hqModelTypeahead]'
})
export class ModelTypeaheadDirective extends TableTypeaheadDirective {

    constructor(
        protected viewContainerRef: ViewContainerRef,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected httpService: HttpService,
    ) {
        super(viewContainerRef, componentFactoryResolver);
        this.showTitle = false;
    }

    protected columns = [
        { name: 'name', title: '车系' },
    ] as Array<TableTypeaheadColumn>;

    @Input()
    brandId: string;
    @Input()
    seriesId: string;

    ngOnInit() {
        this.source = (params: TypeaheadRequestParams) => {
            let request = new ModelSearchRequest();
            request['vehicleName'] = params.text;
            request['brandId'] = this.brandId;
            request['seriesId'] = this.seriesId;
            request.setPage(params.pageIndex, params.pageSize);
            let url = Urls.chain.concat('/Vehicles/search');
            console.log('请求参数对象：', request);
            return this.httpService.getPagedList<any>(url, request);
        };
        super.ngOnInit();
    }

}

class ModelSearchRequest extends PagedParams {
    constructor(
        public brandId?: string, // 品牌ID
        public seriesId?: string, // 车系ID
        public vehicleName?: string, // 车型名称
    ) {
        super();
    }
}

