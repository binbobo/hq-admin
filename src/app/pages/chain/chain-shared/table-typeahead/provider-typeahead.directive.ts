import { Directive, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams } from 'app/shared/models';

@Directive({
  selector: '[hqProviderTypeahead]'
})
export class ProviderTypeaheadDirective extends TableTypeaheadDirective {

  constructor(
    protected viewContainerRef: ViewContainerRef,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected httpService: HttpService,
  ) {
    super(viewContainerRef, componentFactoryResolver);
  }

  protected columns = [
    { name: 'name', title: '名称', weight: 1 },
    { name: 'contactUser', title: '联系人' },
  ] as Array<TableTypeaheadColumn>;
  
  protected filed: string = 'name';

  ngOnInit() {
    this.source = (params: TypeaheadRequestParams) => {
      let request = new PagedParams();
      request[this.filed] = params.text;
      request.setPage(params.pageIndex, params.pageSize);
      let url = Urls.chain.concat('/Suppliers/GetValidList');
      return this.httpService.getPagedList<any>(url, request);
    };
    super.ngOnInit();
  }

}
