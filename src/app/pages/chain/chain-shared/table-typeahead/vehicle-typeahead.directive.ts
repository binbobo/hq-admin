import { Directive, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams } from 'app/shared/models';

@Directive({
  selector: '[hqVehicleTypeahead]'
})
export class VehicleTypeaheadDirective extends TableTypeaheadDirective {

  constructor(
    protected viewContainerRef: ViewContainerRef,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected httpService: HttpService,
  ) {
    super(viewContainerRef, componentFactoryResolver);
  }

  protected columns = [
    { name: 'brandName', title: '品牌' },
    { name: 'seriesName', title: '车系' },
    { name: 'name', title: '车型', checked: true },
  ] as Array<TableTypeaheadColumn>;

  @Input()
  protected filed: string = 'name';

  ngOnInit() {
    this.multiple = true;
    this.source = (params: TypeaheadRequestParams) => {
      let request = new VehicleSearchRequest();
      request[this.filed] = params.text;
      request.setPage(params.pageIndex, params.pageSize);
      let url = Urls.chain.concat('/Vehicles/GetAllVehicle');
      return this.httpService.getPagedList<any>(url, request);
    };
    super.ngOnInit();
  }

}

class VehicleSearchRequest extends PagedParams {
  constructor(
    public name?: string,
  ) {
    super();
  }
}

