import { Directive, ViewContainerRef, Input, Optional, Injector } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams } from 'app/shared/models';
import { FormControlName, NgModel } from '@angular/forms';

@Directive({
    selector: '[hqMaintenanceItemTypeahead]'
})
export class MaintenanceItemTypeaheadDirective extends TableTypeaheadDirective {

    constructor(
        injector: Injector,
        protected httpService: HttpService,
        protected container?: ViewContainerRef,
    ) {
        super(injector);
        this.showTitle = false;
    }

    protected columns = [
        { name: 'name', title: '维修项目名称', selected: true },
    ] as Array<TableTypeaheadColumn>;

    @Input()
    serviceIds: any[]; // 过滤掉的维修项目列表

    ngOnInit() {
        this.source = (params: TypeaheadRequestParams) => {
            let request = new PagedParams();
            request['keyword'] = params.text;
            request.setPage(params.pageIndex, params.pageSize);
            let url = Urls.chain.concat('/Services/GetByName');
            return this.httpService.getPagedList<any>(url, request).then(pagedData => {
                for (let i = 0; i < this.serviceIds.length; i++) {
                    const index = pagedData.data.findIndex(item => item.id === this.serviceIds[i]);
                    if (index > -1) {
                        pagedData.data.splice(index, 1);
                    }
                }
                return pagedData;
            });
        };
        super.ngOnInit();
    }
}

