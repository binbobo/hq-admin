import { Directive, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams, SelectOption } from 'app/shared/models';

@Directive({
  selector: '[hqProductBrandTypeahead]'
})
export class ProductBrandTypeaheadDirective extends TableTypeaheadDirective {

  constructor(
    protected viewContainerRef: ViewContainerRef,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected httpService: HttpService,
  ) {
    super(viewContainerRef, componentFactoryResolver);
  }

  @Input("hqProductBrandTypeahead")
  protected filed: string;

  protected columns = [
    { name: 'name', title: '配件品牌', weight: 1 },
  ] as Array<TableTypeaheadColumn>;

  ngOnInit() {
    this.filed = this.filed || 'name';
    this.showTitle = false;
    this.source = (params: TypeaheadRequestParams) => {
      let request = new PagedParams();
      request[this.filed] = params.text;
      request.setPage(params.pageIndex, params.pageSize);
      let url = Urls.chain.concat('/Brands/Product/search');
      return this.httpService.getPagedList<any>(url, request);
    };
    super.ngOnInit();
  }

}
