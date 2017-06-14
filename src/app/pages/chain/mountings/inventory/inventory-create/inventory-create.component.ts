import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle, SelectOption, PagedResult } from 'app/shared/models';
import { Inventory, InventoryService } from '../inventory.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators } from '@angular/forms';
import { MountingsService } from '../../../mountings/mountings.service';
import { TypeaheadMatch } from "ngx-bootstrap";
import { TypeaheadRequestParams } from 'app/shared/directives';
import { TreeviewItem, TreeItem } from 'ngx-treeview';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'hq-inventory-create',
  templateUrl: './inventory-create.component.html',
  styleUrls: ['./inventory-create.component.css']
})
export class InventoryCreateComponent extends FormHandle<Inventory> implements OnInit {

  private warehouses: Array<SelectOption>;
  private units: Array<SelectOption>;
  private owned: boolean;
  private selectedProduct: any;

  private get exists() {
    return false;
    // if (!this.selectedProduct) return false;
    // if (!this.form) return false;
    // let locations: Array<{ id: string }> = this.selectedProduct.locations;
    // let locationId = this.form.get('locationId').value;
    // let item = locations.find(m => m.id === locationId);
    // return item;
  }

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
  protected buildForm(): FormGroup {
    return this.formBuilder.group({
      locationName: [this.model.locationName, [Validators.maxLength(50)]],
      locationId: [this.model.locationId, [Validators.maxLength(50)]],
      storeId: [this.model.storeId, [Validators.required, Validators.maxLength(36)]],
      vehicleId: [this.model.vehicleId],
      unit: [this.model.unit, [Validators.required, Validators.maxLength(36)]],
      brandName: [this.model.brandName, [Validators.required, Validators.maxLength(50)]],
      categoryId: [this.model.categoryId, [Validators.required]],
      categoryName: [this.model.category],
      code: [this.model.code, [Validators.required, Validators.maxLength(36)]],
      name: [this.model.name, [Validators.required, Validators.maxLength(60)]],
      productSpecification: [this.model.productSpecification, [Validators.required, Validators.maxLength(20)]],
      maxCount: [this.model.maxCount, [CustomValidators.min(0)]],
      minCount: [this.model.minCount, [CustomValidators.min(0)]],
      brandId: [this.model.brandId],
      packageInfo: [this.model.packageInfo, [Validators.maxLength(20)]],
      madeIn: [this.model.madeIn, [Validators.maxLength(100)]],
      description: [this.model.description, [Validators.maxLength(200)]],
      id: ['']
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.moutingsService.getWarehouseOptions()
      .then(options => this.warehouses = options)
      .then(options => options.length ? options[0].value : '')
      .then(id => this.patchValue('storeId', id))
      .catch(err => this.alerter.warn(err));
    this.moutingsService.getUnitOptions()
      .then(options => this.units = options)
      .then(options => options.length ? options[0].value : '')
      .then(id => this.patchValue('unit', id))
      .catch(err => this.alerter.warn(err));
  }

  get typeaheadParams() {
    return { storeId: this.form.get('storeId').value };
  }

  onStorageChange(event) {
    this.form.patchValue({ locationName: undefined, locationId: undefined });
  }

  onLocationChange(event: Event) {
    if (event.isTrusted) {
      this.form.patchValue({ locationId: undefined });
    }
  }

  onLocationSelect(event) {
    this.form.patchValue({ locationId: event.id });
  }

  onBrandSelect(event) {
    this.form.patchValue({ brandId: event.id });
  }

  onBrandChange(event: Event) {
    if (event.isTrusted) {
      this.form.patchValue({ brandId: undefined });
    }
  }

  public vehicles: Array<any> = [];

  onVehicleSelect(event) {
    this.vehicles = this.vehicles || [];
    let index = this.vehicles.findIndex(m => m.vehicleId === event.vehicleId);
    if (event.checked && !~index) {
      this.vehicles.push(event);
    } else if (!event.checked && ~index) {
      this.vehicles.splice(index, 1);
    }
  }

  onVehicleRemove(event) {
    let index = this.vehicles.indexOf(event);
    if (~index) {
      this.vehicles.splice(index, 1);
    }
  }

  public get vehicleCheckStrategy() {
    return (item) => this.vehicles && this.vehicles.some(m => m.vehicleId === item.vehicleId);
  }

  onItemChange(event, key: string) {
    this.disableItem(false, key);
  }

  public onItemSelect(event) {
    this.selectedProduct = event;
    let item = {
      code: event.code,
      name: event.name,
      packageInfo: event.packageInfo,
      madeIn: event.madeIn,
      brandName: event.brandName,
      brandId: event.brandId,
      productSpecification: event.specification,
      unit: event.unitId,
      categoryId: event.categoryId,
      categoryName: event.categoryName,
      id: event.id,
    };
    this.form.patchValue(item);
    this.vehicles = event.vehicleInfoList;
    this.disableItem(true);
  }

  private onCategoryChange(event: Event) {
    if (event.isTrusted) {
      this.form.patchValue({ categoryId: undefined });
    }
  }

  private onCategorySelect(event) {
    this.form.patchValue({
      categoryId: event.value,
      name: event.text,
    });
  }

  private disableItem(disabled: boolean, ...sources: Array<string>) {
    let keys = ['packageInfo', 'madeIn', 'brandName', 'id'];
    keys.push.apply(keys, sources.filter(m => m));
    if (disabled) {
      this.owned = true;
    } else {
      if (this.owned) {
        this.vehicles = null;
        this.owned = null;
        keys.forEach(key => {
          this.form.controls[key].setValue('');
        });
      }
    }
  }

  onCreate() {
    let formData = this.form.value;
    if (formData.minCount && formData.maxCount && formData.minCount >= formData.maxCount) {
      this.alerter.error('最大库存必须大于最小库存');
      return false;
    }
    let vehicles = this.vehicles && this.vehicles.map(m => m.vehicleId);
    this.form.patchValue({ vehicleId: vehicles });
    return super.onCreate();
  }
}
