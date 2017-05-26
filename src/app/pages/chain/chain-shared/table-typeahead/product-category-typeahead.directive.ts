import { Directive, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams, SelectOption } from 'app/shared/models';

@Directive({
  selector: '[hqProductCategoryTypeahead]'
})
export class ProductCategoryTypeaheadDirective extends TableTypeaheadDirective {

  constructor(
    protected viewContainerRef: ViewContainerRef,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected httpService: HttpService,
  ) {
    super(viewContainerRef, componentFactoryResolver);
  }

  @Input("hqProductCategoryTypeahead")
  protected filed: string;

  protected columns = [
    { name: 'text', title: '配件分类', weight: 1 },
  ] as Array<TableTypeaheadColumn>;

  ngOnInit() {
    this.filed = this.filed || 'name';
    this.showTitle = false;
    this.source = (params: TypeaheadRequestParams) => {
      let request = new PagedParams();
      request[this.filed] = params.text;
      request.setPage(params.pageIndex, params.pageSize);
      let url = Urls.chain.concat('/ProductCategories/SearchOptions');
      return this.httpService.getPagedList<any>(url, request);
    };
    super.ngOnInit();
  }
}
