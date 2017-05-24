import { Directive, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams } from 'app/shared/models';

@Directive({
  selector: '[hqProductTypeahead]'
})
export class ProductTypeaheadDirective extends TableTypeaheadDirective {

  constructor(
    protected viewContainerRef: ViewContainerRef,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected httpService: HttpService,
  ) {
    super(viewContainerRef, componentFactoryResolver);
  }

  protected columns = [
    { name: 'brand', title: '品牌' },
    { name: 'code', title: '配件编码' },
    { name: 'categoryName', title: '配件分类' },
    { name: 'name', title: '配件名称' },
    { name: 'specification', title: '规格型号' },
  ] as Array<TableTypeaheadColumn>;

  @Input("hqProductTypeahead")
  protected filed: string;

  ngOnInit() {
    this.filed = this.filed || 'name';
    this.source = (params: TypeaheadRequestParams) => {
      let request = new ProductSearchRequest();
      request[this.filed] = params.text;
      request.setPage(params.pageIndex, params.pageSize);
      let url = Urls.chain.concat('/Products/SearchInventory');
      return this.httpService.getPagedList<any>(url, request)
        .then(result => {
          result.data = result.data
            .map(m => {
              let category = m.categoryList && m.categoryList.length && m.categoryList[0];
              m.categoryName = category && category.text;
              m.categoryId = category && category.value;
              return m;
            });
          return result;
        })
    };
    super.ngOnInit();
  }

}

class ProductSearchRequest extends PagedParams {
  constructor(
    public name?: string,
    public code?: string,
  ) {
    super();
  }
}

