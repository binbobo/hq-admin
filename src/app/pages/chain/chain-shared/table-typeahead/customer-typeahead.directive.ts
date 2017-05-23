import { Directive, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams } from 'app/shared/models';

@Directive({
  selector: '[hqCustomerTypeahead]'
})
export class CustomerTypeaheadDirective extends TableTypeaheadDirective {

  constructor(
    protected viewContainerRef: ViewContainerRef,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected httpService: HttpService,
  ) {
    super(viewContainerRef, componentFactoryResolver);
  }

  protected columns = [
    { name: 'name', title: '客户名称', weight: 1 },
    { name: 'phone', title: '手机号' }
  ] as Array<TableTypeaheadColumn>;
  @Input("hqCustomerTypeahead")
  protected filed: string = 'name';

  ngOnInit() {
    this.source = (params: TypeaheadRequestParams) => {
      let request = new CustomerSearchRequest();
      request[this.filed] = params.text;
      request.setPage(params.pageIndex, params.pageSize);
      let url = Urls.chain.concat('/Customers/Search');
      return this.httpService.getPagedList<any>(url, request);
    };
    super.ngOnInit();
  }

}

class CustomerSearchRequest extends PagedParams {
  constructor(
    public name?: string,
    public phone?: string,
    public plateNo?: string,
  ) {
    super();
  }
}
