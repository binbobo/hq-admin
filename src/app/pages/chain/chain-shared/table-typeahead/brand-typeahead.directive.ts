import { Directive, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams } from 'app/shared/models';
import { element } from 'protractor';

@Directive({
    selector: '[hqBrandTypeahead]'
})
export class BrandTypeaheadDirective extends TableTypeaheadDirective {

    constructor(
        protected viewContainerRef: ViewContainerRef,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected httpService: HttpService,
    ) {
        super(viewContainerRef, componentFactoryResolver);
        this.showTitle = false;
    }

    protected columns = [
        { name: 'brandName', title: '品牌' },
        { name: 'seriesName', title: '车系' },
        { name: 'vehicle', title: '车辆信息' },
    ] as Array<TableTypeaheadColumn>;

    @Input()
    protected filed: string = 'brandName';

    ngOnInit() {
        this.source = (params: TypeaheadRequestParams) => {
            let request = new BrandSearchRequest();
            request[this.filed] = params.text;
            request.setPage(params.pageIndex, params.pageSize);
            let url = Urls.chain.concat('/Brands/search');
            return this.httpService.getPagedList<any>(url, request)
                .then(result => {
                    result.data.forEach(element => {
                        element.vehicle = element.vehicleYear + " " + element.name;
                    });
                    return result;
                });
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

