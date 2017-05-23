import { Directive, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams } from 'app/shared/models';

@Directive({
    selector: '[hqCustomerVehicleTypeahead]'
})
export class CustomerVehicleTypeaheadDirective extends TableTypeaheadDirective {

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
            let request = new CustomerVehicleSearchRequest();
            request[this.filed] = params.text;
            request.setPage(params.pageIndex, params.pageSize);
            let url = Urls.chain.concat('/Customers/GetByName');
            return this.httpService.getPagedList<any>(url, request).then(response => {
                // 加工数据
                console.log('根据车主名称查询客户车辆信息：', response.data);
                // 每个车主下面可能有多个车辆信息
                const customerVehicles: CustomerVehicle[] = [];
                response.data.forEach((customer) => {
                    if (!customer.customerVehicles) { return; };
                    customer.customerVehicles.forEach(vehicle => {
                        const customerVehicle = new CustomerVehicle(
                            vehicle.id, // 客户车辆id
                            vehicle.vehicleId,  // 车辆id
                            vehicle.customerId, // 客户id
                            vehicle.plateNo,
                            customer.name,
                            customer.phone,
                            vehicle.series,
                            vehicle.vehicleName,
                            vehicle.brand,
                            vehicle.mileage,
                            vehicle.purchaseDate,
                            vehicle.vin,  // 底盘号
                        );
                        customerVehicles.push(customerVehicle);
                    });
                });
                response.data = customerVehicles;
                return response;
            });
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

