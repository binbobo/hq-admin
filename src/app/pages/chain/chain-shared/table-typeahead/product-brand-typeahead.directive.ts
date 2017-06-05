import { Directive, Input, Injector, ViewContainerRef } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams, SelectOption } from 'app/shared/models';

@Directive({
  selector: '[hqProductBrandTypeahead]'
})
export class ProductBrandTypeaheadDirective extends TableTypeaheadDirective {

  constructor(
    injector: Injector,
    protected httpService: HttpService,
    protected container?: ViewContainerRef,
  ) {
    super(injector);
  }

  @Input("hqProductBrandTypeahead")
  protected field: string;

  protected columns = [
    { name: 'name', title: '配件品牌', selected: true },
  ] as Array<TableTypeaheadColumn>;

  ngOnInit() {
    this.field = this.field || 'brandName';
    this.showTitle = false;
    this.source = (params: TypeaheadRequestParams) => {
      let request = new PagedParams();
      request[this.field] = params.text;
      request.setPage(params.pageIndex, params.pageSize);
      let url = Urls.chain.concat('/Brands/Product/search');
      return this.httpService.getPagedList<any>(url, request);
    };
    super.ngOnInit();
  }

}
