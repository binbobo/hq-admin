import { Directive, Input, Injector, ViewContainerRef, Optional } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams } from 'app/shared/models';
import { FormControlName } from '@angular/forms';

@Directive({
    selector: '[hqSeriesTypeahead]'
})
export class SeriesTypeaheadDirective extends TableTypeaheadDirective {

    constructor(
        injector: Injector,
        protected httpService: HttpService,
        protected container: ViewContainerRef,
        @Optional()
        private formControlName?: FormControlName,
    ) {
        super(injector);
    }

    protected columns = [
        { name: 'name', title: '车系', selected: true },
    ] as Array<TableTypeaheadColumn>;

    @Input()
    brandId: string;

    ngOnInit() {
        this.source = (params: TypeaheadRequestParams) => {
            let request = new PagedParams();
            request['serieName'] = params.text;
            request['brandId'] = this.brandId;
            request.setPage(params.pageIndex, params.pageSize);
            let url = Urls.chain.concat('/VehicleSeries/search');
            console.log('根据车系名称查询车系信息：', url, request);
            return this.httpService.getPagedList<any>(url, request);
        };
        super.ngOnInit();
    }

}

