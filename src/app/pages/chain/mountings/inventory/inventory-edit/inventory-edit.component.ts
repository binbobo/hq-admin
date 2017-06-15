import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle, SelectOption } from 'app/shared/models';
import { Inventory, InventoryService } from '../inventory.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MountingsService } from '../../mountings.service';
import { SweetAlertService } from "app/shared/services";

@Component({
  selector: 'hq-inventory-edit',
  templateUrl: './inventory-edit.component.html',
  styleUrls: ['./inventory-edit.component.css']
})
export class InventoryEditComponent extends FormHandle<Inventory> implements OnInit {

  private vehicles: Array<any> = [];
  private warehouses: Array<SelectOption>;
  private units: Array<SelectOption>;

  constructor(
    injector: Injector,
    service: InventoryService,
    private moutingsService: MountingsService,
    private sweetAlertService: SweetAlertService,
  ) {
    super(injector, service);
  }

  private get editable() {
    return this.model.dataSource === "2" ? undefined : true;
  }

  protected getModel(): Observable<Inventory> {
    if (Array.isArray(this.model.categoryList) && this.model.categoryList.length) {
      let category = this.model.categoryList[0];
      this.model.categoryId = category.value;
      this.model.category = category.text;
    }
    return Observable.of(this.model)
  }
  protected buildForm(): FormGroup {
    return this.formBuilder.group({
      locationName: [this.model.locationName, [Validators.maxLength(50)]],
      locationId: [this.model.locationId, [Validators.maxLength(50)]],
      storeId: [this.model.storeId, [Validators.required, Validators.maxLength(36)]],
      vehicleId: [this.model.vehicleId],
      unit: [this.model.unitId, [Validators.required, Validators.maxLength(36)]],
      categoryId: [this.model.categoryId, [Validators.required]],
      categoryName: [this.model.category],
      code: [this.model.code, [Validators.required, Validators.maxLength(36)]],
      name: [this.model.name, [Validators.required, Validators.maxLength(60)]],
      productSpecification: [this.model['specification'], [Validators.required, Validators.maxLength(20)]],
      maxCount: [this.model.maxCount, [CustomValidators.min(0)]],
      minCount: [this.model.minCount, [CustomValidators.min(0)]],
      brandId: [this.model.brandId],
      packageInfo: [this.model.packageInfo, [Validators.maxLength(20)]],
      madeIn: [this.model.madeIn, [Validators.maxLength(100)]],
      description: [this.model.description, [Validators.maxLength(200)]],
      id: [this.model.id],
      brandName: [this.model.brand, [Validators.required, Validators.maxLength(50)]],
    });
  }

  ngOnInit() {
    super.ngOnInit();
    if (Array.isArray(this.model.vehicleInfoList)) {
      this.vehicles = this.model.vehicleInfoList;
    }
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

  onBrandSelect(event) {
    this.form.patchValue({ brandId: event.id });
  }

  onBrandChange(event: Event) {
    if (event.isTrusted) {
      this.form.patchValue({ brandId: undefined });
    }
  }

  onLocationChange(event: Event) {
    if (event.isTrusted) {
      this.form.patchValue({ locationId: undefined });
    }
  }

  onLocationSelect(event) {
    this.form.patchValue({ locationId: event.id, locationName: event.name });
  }

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

  onUpdate() {
    let formData = this.form.value;
    let vehicles = this.vehicles && this.vehicles.map(m => m.vehicleId);
    this.form.patchValue({ vehicleId: vehicles });
    if (formData.locationId !== this.model.locationId && formData.locationName) {
      let msg = `是否将${this.model.name}(库存量：${this.model.count})全部移至${formData.locationName}？`;
      return this.sweetAlertService.confirm({ text: msg })
        .then(() => super.onUpdate(),()=>{})
    } else {
      return super.onUpdate();
    }
  }
}
