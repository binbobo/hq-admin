import { Directive, Input, Optional, Injector, ViewContainerRef } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams } from 'app/shared/models';
import { FormControlName, NgModel } from '@angular/forms';

@Directive({
  selector: '[hqCustomerTypeahead]'
})
export class CustomerTypeaheadDirective extends TableTypeaheadDirective {

  constructor(
    injector: Injector,
    protected httpService: HttpService,
    protected container: ViewContainerRef,
  ) {
    super(injector);
  }

  protected columns = [
    { name: 'name', title: '客户名称' },
    { name: 'phone', title: '手机号' }
  ] as Array<TableTypeaheadColumn>;

  @Input("hqCustomerTypeahead")
  protected field: string = 'name';

  ngOnInit() {
    this.field = this.field || 'name';
    this.source = (params: TypeaheadRequestParams) => {
      let request = new CustomerSearchRequest();
      request[this.field] = params.text;
      request.setPage(params.pageIndex, params.pageSize);
      let url = Urls.chain.concat('/Customers/Search');
      return this.httpService.getPagedList<any>(url, request);
    };
    this.field === 'name' && (this.columns[0].selected = true);
    this.field === 'phone' && (this.columns[1].selected = true);
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
