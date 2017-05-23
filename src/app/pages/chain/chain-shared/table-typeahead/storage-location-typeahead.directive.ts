import { Directive, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams } from 'app/shared/models';

@Directive({
  selector: '[hqStorageLocationTypeahead]'
})
export class StorageLocationTypeaheadDirective extends TableTypeaheadDirective {

  @Input('hqStorageLocationTypeahead')
  protected filed: string = 'name';

  constructor(
    protected viewContainerRef: ViewContainerRef,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected httpService: HttpService,
  ) {
    super(viewContainerRef, componentFactoryResolver);
  }

  protected columns = [
    { name: 'name', title: '库位', weight: 1 },
  ] as Array<TableTypeaheadColumn>;

  ngOnInit() {
    this.source = (params: TypeaheadRequestParams) => {
      let request = new PagedParams();
      request[this.filed] = params.text;
      request.setPage(params.pageIndex, params.pageSize);
      Object.assign(request, this.params);
      let url = Urls.chain.concat('/storageLocations/getByHouseId');
      return this.httpService.getPagedList<any>(url, request);
    };
    super.ngOnInit();
  }

}
