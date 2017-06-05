import { Directive, Input, Injector, ViewContainerRef } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams } from 'app/shared/models';

@Directive({
  selector: '[hqVehicleTypeahead]'
})
export class VehicleTypeaheadDirective extends TableTypeaheadDirective {

  constructor(
    injector: Injector,
    protected httpService: HttpService,
    protected container: ViewContainerRef,
  ) {
    super(injector);
  }

  protected columns = [
    { name: 'brandName', title: '品牌' },
    { name: 'seriesName', title: '车系' },
    { name: 'name', title: '车型', checked: true },
  ] as Array<TableTypeaheadColumn>;

  @Input()
  protected field: string = 'name';

  ngOnInit() {
    this.multiple = true;
    this.source = (params: TypeaheadRequestParams) => {
      let request = new VehicleSearchRequest();
      request[this.field] = params.text;
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

