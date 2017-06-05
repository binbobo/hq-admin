import { Directive, Input, Injector, ViewContainerRef } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams, SelectOption } from 'app/shared/models';

@Directive({
  selector: '[hqProductCategoryTypeahead]'
})
export class ProductCategoryTypeaheadDirective extends TableTypeaheadDirective {

  constructor(
    injector: Injector,
    protected httpService: HttpService,
    protected container?: ViewContainerRef,
  ) {
    super(injector);
  }

  @Input("hqProductCategoryTypeahead")
  protected field: string;

  protected columns = [
    { name: 'text', title: '配件分类', selected: true },
  ] as Array<TableTypeaheadColumn>;

  ngOnInit() {
    this.field = this.field || 'name';
    this.showTitle = false;
    this.source = (params: TypeaheadRequestParams) => {
      let request = new PagedParams();
      request[this.field] = params.text;
      request.setPage(params.pageIndex, params.pageSize);
      let url = Urls.chain.concat('/ProductCategories/SearchOptions');
      return this.httpService.getPagedList<any>(url, request);
    };
    super.ngOnInit();
  }
}
