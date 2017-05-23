import { Directive, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams } from 'app/shared/models';

@Directive({
    selector: '[hqPlateNoTypeahead]'
})
export class PlateNoTypeaheadDirective extends TableTypeaheadDirective {

    constructor(
        protected viewContainerRef: ViewContainerRef,
        protected componentFactoryResolver: ComponentFactoryResolver,
        protected httpService: HttpService,
    ) {
        super(viewContainerRef, componentFactoryResolver);
    }

    protected columns = [
        { name: 'plateNo', title: '车牌号' },
        { name: 'customerName', title: '车主' },
        { name: 'phone', title: '车主电话' },
    ] as Array<TableTypeaheadColumn>;

    @Input()
    protected filed: string = 'keyword';

    ngOnInit() {
        this.source = (params: TypeaheadRequestParams) => {
            let request = new PlateNoSearchRequest();
            request[this.filed] = params.text;
            request.setPage(params.pageIndex, params.pageSize);
            let url = Urls.chain.concat('/CustomerVehicles/Search');
            return this.httpService.getPagedList<any>(url, request).then(response => {
                console.log('根据车牌号模糊查询客户车辆信息 响应数据', response);
                // 加工数据
                response.data = response.data.map(item => {
                    const o = item;
                    o.customerName = item.customerInfo.name;
                    o.phone = item.customerInfo.phone;
                    return o;
                });
                return response;
            });
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

