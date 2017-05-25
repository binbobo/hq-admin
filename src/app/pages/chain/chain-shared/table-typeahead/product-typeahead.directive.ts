import { Directive, ViewContainerRef, ComponentFactoryResolver, Input } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams, SelectOption } from 'app/shared/models';

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

  @Input("hqProductTypeahead")
  protected filed: string;

  protected columns = [
    { name: 'brandName', title: '品牌' },
    { name: 'code', title: '配件编码' },
    { name: 'categoryName', title: '配件分类' },
    { name: 'name', title: '配件名称' },
    { name: 'specification', title: '规格型号' },
  ] as Array<TableTypeaheadColumn>;

  ngOnInit() {
    this.filed = this.filed || 'name';
    this.source = (params: TypeaheadRequestParams) => {
      let request = new ProductSearchRequest();
      request[this.filed] = params.text;
      request.setPage(params.pageIndex, params.pageSize);
      let url = Urls.chain.concat('/Products/SearchSingleInventory');
      return this.httpService.getPagedList<any>(url, request)
        .then(result => {
          result.data = result.data.map(m => this.map(m));
          return result;
        })
    };
    this.filed === 'code' && (this.columns[1].weight = 1);
    this.filed === 'name' && (this.columns[3].weight = 1);
    super.ngOnInit();
  }

  private map(item: any): any {
    if (!item) return item;
    let category = Array.isArray(item.categoryList) && item.categoryList.length && item.categoryList[0];
    item.categoryName = category && category.text;
    item.categoryId = category && category.value;
    item.storages = [];
    if (Array.isArray(item.inventoryItems)) {
      item.inventoryItems.forEach(m => {
        let current = item.storages.find(s => s.id === m.id);
        if (!current) {
          current = { id: m.id, name: m.name, locations: [] };
          item.storages.push(current);
        }
        current.locations.push({
          id: m.locationId,
          name: m.locationName,
          count: m.count || 0
        });
      });
    }
    return item;
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

