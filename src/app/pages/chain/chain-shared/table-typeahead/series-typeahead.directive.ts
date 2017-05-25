import { Directive, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams } from 'app/shared/models';

@Directive({
    selector: '[hqSeriesTypeahead]'
})
export class SeriesTypeaheadDirective extends TableTypeaheadDirective {

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

    ngOnInit() {
        this.source = (params: TypeaheadRequestParams) => {
            let request = new SeriesSearchRequest();
            request['seriesName'] = params.text;
            request['brandId'] = this.brandId;
            request.setPage(params.pageIndex, params.pageSize);
            let url = Urls.chain.concat('/VehicleSeries/search');
            return this.httpService.getPagedList<any>(url, request);
        };
        super.ngOnInit();
    }

}

class SeriesSearchRequest extends PagedParams {
    constructor(
        public brandId?: string, // 品牌ID
        public seriesName?: string, // 车系名称
    ) {
        super();
    }
}

