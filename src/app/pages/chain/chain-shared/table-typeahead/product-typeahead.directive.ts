import { Directive, Input, Injector, ViewContainerRef, Optional } from '@angular/core';
import { TableTypeaheadDirective, TableTypeaheadColumn, TypeaheadRequestParams } from 'app/shared/directives';
import { HttpService, Urls } from 'app/shared/services';
import { PagedParams, SelectOption } from 'app/shared/models';
import { FormControlName } from '@angular/forms';

@Directive({
  selector: '[hqProductTypeahead]',
  exportAs: 'hq-product-typeahead',
})
export class ProductTypeaheadDirective extends TableTypeaheadDirective {

  constructor(
    injector: Injector,
    protected httpService: HttpService,
    protected container: ViewContainerRef,
    @Optional()
    private formControlName?: FormControlName,
  ) {
    super(injector);
  }

  @Input("hqProductTypeahead")
  protected field: string;

  protected columns = [
    { name: 'brandName', title: '品牌' },
    { name: 'code', title: '配件编码' },
    { name: 'categoryName', title: '配件分类' },
    { name: 'name', title: '配件名称' },
    { name: 'specification', title: '规格型号' },
    { name: 'count', title: '库存量' },
  ] as Array<TableTypeaheadColumn>;

  ngOnInit() {
    this.field = this.field || 'name';
    this.source = (params: TypeaheadRequestParams) => {
      let request = new ProductSearchRequest();
      request[this.field] = params.text;
      request.setPage(params.pageIndex, params.pageSize);
      let url = Urls.chain.concat('/Products/SearchSingleInventory');
      return this.httpService.getPagedList<any>(url, request)
        .then(result => {
          result.data = result.data.map(m => this.map(m));
          return result;
        })
    };
    this.field === 'code' && (this.columns[1].selected = true);
    this.field === 'name' && (this.columns[3].selected = true);
    super.ngOnInit();
  }

  private map(item: any): any {
    if (!item) return item;
    let category = Array.isArray(item.categoryList) && item.categoryList.length && item.categoryList[0];
    item.categoryName = category && category.text;
    item.categoryId = category && category.value;
    item.storages = [];
    item.count = 0;
    if (Array.isArray(item.inventoryItems)) {
      item.inventoryItems.forEach(m => {
        item.count += m.count;
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

