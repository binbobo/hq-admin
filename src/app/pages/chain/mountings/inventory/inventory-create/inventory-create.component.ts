import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle, SelectOption, PagedResult } from 'app/shared/models';
import { Inventory, InventoryService } from '../inventory.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators } from '@angular/forms';
import { MountingsService, GetMountingsListRequest } from '../../../mountings/mountings.service';
import { TypeaheadMatch } from "ngx-bootstrap";
import { TypeaheadRequestParams } from 'app/shared/directives';
import { TreeviewItem, TreeItem } from 'ngx-treeview';

@Component({
  selector: 'hq-inventory-create',
  templateUrl: './inventory-create.component.html',
  styleUrls: ['./inventory-create.component.css']
})
export class InventoryCreateComponent extends FormHandle<Inventory> implements OnInit {

  private warehouses: Array<SelectOption>;
  private units: Array<SelectOption>;
  private categories: Array<TreeviewItem>;
  private brands: Array<SelectOption>;
  public items: Array<any> = [];
  private owned: boolean;

  constructor(
    injector: Injector,
    service: InventoryService,
    private moutingsService: MountingsService,
  ) {
    super(injector, service);
  }

  protected getModel(): Observable<Inventory> {
    return Observable.of(new Inventory())
  }
  protected buidForm(): FormGroup {
    return this.formBuilder.group({
      locationName: [this.model.locationName, [Validators.maxLength(50)]],
      storeId: [this.model.storeId, [Validators.required, Validators.maxLength(36)]],
      vehicleId: [this.model.vehicleId],
      unit: [this.model.unit, [Validators.required, Validators.maxLength(36)]],
      brandName: [this.model.brandName, [Validators.required, Validators.maxLength(50)]],
      categoryId: [this.model.categoryId],
      code: [this.model.code, [Validators.required, Validators.maxLength(36)]],
      name: [this.model.name, [Validators.required, Validators.maxLength(60)]],
      maxCount: [this.model.maxCount],
      minCount: [this.model.minCount],
      brandId: [this.model.brandId],
      packageInfo: [this.model.packageInfo, [Validators.maxLength(20)]],
      madeIn: [this.model.madeIn, [Validators.maxLength(100)]],
      description: [this.model.description, [Validators.maxLength(200)]],
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.moutingsService.getWarehouseOptions()
      .then(options => this.warehouses = options)
      .then(options => options.length ? options[0].value : '')
      .then(id => this.patchValue('storeId', id))
      .catch(err => this.alerter.warn(err));
    this.moutingsService.getCategoryOptions()
      .then(options => options.map(m => new TreeviewItem(m as TreeItem)))
      .then(options => this.categories = options)
      .then(options => options.length ? options[0].value : '')
      .then(id => this.patchValue('categoryId', id))
      .catch(err => this.alerter.warn(err));
    this.moutingsService.getUnitOptions()
      .then(options => this.units = options)
      .then(options => options.length ? options[0].value : '')
      .then(id => this.patchValue('unit', id))
      .catch(err => this.alerter.warn(err));
    this.moutingsService.getBrands()
      .then(options => this.brands = options)
      .catch(err => this.alerter.warn(err));
  }

  onBrandSelect(event: TypeaheadMatch) {
    this.form.patchValue({ brandId: event.item.value });
  }

  onBrandChange(event: Event) {
    this.form.patchValue({ brandId: undefined });
  }

  public vehicles: Array<any> = [];
  private _vehicles: Array<any> = [];

  onVehicleSelect(event) {
    let index = this.vehicles.findIndex(m => m.id === event.id);
    if (!~index) {
      this.vehicles.push(event);
    }
  }

  onVehicleRemove(event) {
    let index = this.vehicles.findIndex(m => m.id === event.id);
    if (~index) {
      this.vehicles.splice(index, 1);
    }
    let item = this._vehicles.find(m => m.id === event.id);
    if (item) {
      item.checked = false;
    }
  }

  public get vehicleColumns() {
    return [
      { name: 'brandName', title: '品牌' },
      { name: 'seriesName', title: '车系' },
      { name: 'name', title: '车型', checked: true },
    ];
  }

  public get vehicleSource() {
    return (params: TypeaheadRequestParams) => {
      return this.moutingsService.get(params.text)
        .then(result => {
          result.data.forEach(m => m.checked = this.vehicles.some(n => m.id === n.id))
          this._vehicles = result.data;
          return result;
        });
    };
  }

  public itemColumns(isName: boolean) {
    return [
      { name: 'name', title: '名称', weight: isName ? 1 : 0 },
      { name: 'code', title: '编码', weight: isName ? 0 : 1 },
      { name: 'brand', title: '品牌' },
    ];
  }

  onItemChange(event) {
    this.disableItem(false);
  }

  public onItemSelect(event) {
    let item = {
      code: event.code,
      name: event.name,
      packageInfo: event.packageInfo,
      madeIn: event.madeIn,
      brandName: event.brand,
      brandId: event.brandId
    }
    this.form.patchValue(item);
    this.disableItem(true);
  }

  private disableItem(disabled: boolean) {
    let keys = ['packageInfo', 'madeIn', 'brandName'];
    if (disabled) {
      this.owned = true;
    } else {
      this.owned = undefined;
      keys.forEach(key => {
        this.form.controls[key].setValue('');
      });
    }
  }

  public get codeSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new GetMountingsListRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.moutingsService.getListByCodeOrName(p);
    };
  }

  public get nameSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new GetMountingsListRequest(undefined, params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.moutingsService.getListByCodeOrName(p);
    };
  }

  onCategorySelect(event) {
    this.form.patchValue({ categoryId: event });
  }

  onReset() {
    this.vehicles = [];
    super.onReset();
  }

  onCreate() {
    let vehicles = this.vehicles.map(m => m.id);
    this.form.patchValue({ vehicleId: vehicles });
    return super.onCreate();
  }
}
