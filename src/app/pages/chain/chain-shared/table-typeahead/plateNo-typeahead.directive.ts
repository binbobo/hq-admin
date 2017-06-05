import { Directive, ViewContainerRef, ComponentFactoryResolver, Input, Injector } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams } from 'app/shared/models';

@Directive({
    selector: '[hqPlateNoTypeahead]'
})
export class PlateNoTypeaheadDirective extends TableTypeaheadDirective {

    constructor(
        injector: Injector,
        protected httpService: HttpService,
    ) {
        super(injector);
        this.showTitle = false;
    }

    protected columns = [
        { name: 'plateNo', title: '车牌号' },
        { name: 'name', title: '车主' },
        { name: 'phone', title: '车主电话' },
    ] as Array<TableTypeaheadColumn>;

    ngOnInit() {
        this.source = (params: TypeaheadRequestParams) => {
            let request = new PlateNoSearchRequest();
            request['keyword'] = params.text;
            request.setPage(params.pageIndex, params.pageSize);
            let url = Urls.chain.concat('/CustomerVehicles/Search');
            return this.httpService.getPagedList<any>(url, request);
        };
        super.ngOnInit();
    }

}

class PlateNoSearchRequest extends PagedParams {
    constructor(
        public keyword?: string,
    ) {
        super();
    }
}

