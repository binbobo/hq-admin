import { Directive, Input, Injector, ViewContainerRef } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams } from 'app/shared/models';
import { FormControlName, NgModel } from '@angular/forms';

@Directive({
    selector: '[hqCustomerVehicleTypeahead]'
})
export class CustomerVehicleTypeaheadDirective extends TableTypeaheadDirective {

    constructor(
        injector: Injector,
        protected httpService: HttpService,
        protected container: ViewContainerRef,
    ) {
        super(injector);
    }

    protected columns = [
        { name: 'plateNo', title: '车牌号' },
        { name: 'name', title: '车主' },
        { name: 'phone', title: '车主电话' },
    ] as Array<TableTypeaheadColumn>;

    @Input()
    protected field: string = 'keyword';

    ngOnInit() {
        this.source = (params: TypeaheadRequestParams) => {
            let request = new CustomerVehicleSearchRequest();
            request[this.field] = params.text;
            request.setPage(params.pageIndex, params.pageSize);
            let url = Urls.chain.concat('/Customers/GetByName');
            return this.httpService.getPagedList<any>(url, request);
        };
        super.ngOnInit();
    }

}

class CustomerVehicleSearchRequest extends PagedParams {
    constructor(
        public keyword?: string,
    ) {
        super();
    }
}

// 客户车辆关系model类
export class CustomerVehicle {
    constructor(
        public id: string = '', // 客户车辆id
        public vehicleId: string = '', // 车辆id
        public customerId: string = '', // 客户id
        public plateNo: string = '', // 车牌号
        public customerName: string = '', // 车主
        public phone: string = '', // 车主电话
        public series: string = '', // 车系
        public vehicleName: string = '', // 车型
        public brand: string = '', // 品牌
        public mileage: string = '', // 行驶里程
        public purchaseDate: Date = null, // 购车时间
        public vin: string = '', // vin, 车辆唯一编码
    ) {
    }
}

