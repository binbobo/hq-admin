import { Directive, Injector, ComponentFactoryResolver, ViewContainerRef, Input, Optional } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams } from 'app/shared/models';
import { FormControlName } from '@angular/forms';

@Directive({
  selector: '[hqProviderTypeahead]'
})
export class ProviderTypeaheadDirective extends TableTypeaheadDirective {

  constructor(
    injector: Injector,
    protected httpService: HttpService,
    protected container: ViewContainerRef,
    @Optional()
    private formControlName?: FormControlName,
  ) {
    super(injector);
  }

  protected columns = [
    { name: 'name', title: '名称', selected: true },
    { name: 'contactUser', title: '联系人' },
  ] as Array<TableTypeaheadColumn>;

  @Input('hqProviderTypeahead')
  protected field: string = 'name';

  ngOnInit() {
    this.source = (params: TypeaheadRequestParams) => {
      let request = new PagedParams();
      request[this.field] = params.text;
      request.setPage(params.pageIndex, params.pageSize);
      let url = Urls.chain.concat('/Suppliers/GetValidList');
      return this.httpService.getPagedList<any>(url, request);
    };
    super.ngOnInit();
  }

}
