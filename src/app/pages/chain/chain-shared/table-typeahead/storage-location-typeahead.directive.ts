import { Directive, Input, Injector, ViewContainerRef, Optional } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams } from 'app/shared/models';
import { FormControlName } from '@angular/forms';

@Directive({
  selector: '[hqStorageLocationTypeahead]'
})
export class StorageLocationTypeaheadDirective extends TableTypeaheadDirective {

  @Input('hqStorageLocationTypeahead')
  protected field: string = 'name';

  constructor(
    injector: Injector,
    protected httpService: HttpService,
    protected container?: ViewContainerRef,
    @Optional()
    private formControlName?: FormControlName,
  ) {
    super(injector);
  }

  protected columns = [
    { name: 'name', title: '库位', selected: true },
  ] as Array<TableTypeaheadColumn>;

  ngOnInit() {
    this.source = (params: TypeaheadRequestParams) => {
      let request = new PagedParams();
      request[this.field] = params.text;
      request.setPage(params.pageIndex, params.pageSize);
      Object.assign(request, this.params);
      let url = Urls.chain.concat('/storageLocations/getByHouseId');
      return this.httpService.getPagedList<any>(url, request);
    };
    super.ngOnInit();
  }

}
