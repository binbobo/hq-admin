import { Directive, Injector } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams } from 'app/shared/models';
import { element } from 'protractor';
import { FormControlName, NgModel } from '@angular/forms';

@Directive({
    selector: '[hqBrandTypeahead]'
})
export class BrandTypeaheadDirective extends TableTypeaheadDirective {

    constructor(
        injector: Injector,
        protected httpService: HttpService,
    ) {
        super(injector);
        // 不显示标题
        this.showTitle = false;
    }

    protected columns = [
        { name: 'name', title: '品牌', selected: true },
    ] as Array<TableTypeaheadColumn>;

    ngOnInit() {
        this.source = (params: TypeaheadRequestParams) => {
            let request = new BrandSearchRequest();
            request['brandName'] = params.text;
            request.setPage(params.pageIndex, params.pageSize);
            let url = Urls.chain.concat('/Brands/search');
            return this.httpService.getPagedList<any>(url, request);
        };
        super.ngOnInit();
    }

}

class BrandSearchRequest extends PagedParams {
    constructor(
        public brandName?: string, // 品牌名称
    ) {
        super();
    }
}

