import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { Inventory, InventoryService } from '../inventory.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'hq-inventory-edit',
  templateUrl: './inventory-edit.component.html',
  styleUrls: ['./inventory-edit.component.css']
})
export class InventoryEditComponent extends FormHandle<Inventory> implements OnInit {

  private vehicles: Array<any> = [];

  constructor(
    injector: Injector,
    service: InventoryService,
  ) {
    super(injector, service);
  }

  protected getModel(): Observable<Inventory> {
    return Observable.of(this.model)
  }
  protected buidForm(): FormGroup {
    return this.formBuilder.group({
      id: [this.model.id],
      storeId: [this.model.storeId],
      locationId: [this.model.locationId],
      locationName: [this.model.locationName, [Validators.required, Validators.maxLength(50)]],
      maxCount: [this.model.maxCount, [CustomValidators.min(0)]],
      minCount: [this.model.minCount, [CustomValidators.min(0)]],
      description: [this.model.description, [Validators.maxLength(200)]],
      vehicleId: [this.model.vehicleId],
    });
  }

  ngOnInit() {
    super.ngOnInit();
    if (Array.isArray(this.model.vehicleInfoList)) {
      this.vehicles = this.model.vehicleInfoList;
    }
  }

  get typeaheadParams() {
    return { storeId: this.model.storeId };
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
    if (this.model.count > 0) {
      let formData = this.form.value;
      if (formData.locationId !== this.model.locationId && formData.locationName) {
        if (!confirm(`是否将${this.model.name}(库存量：${this.model.count})全部移至${formData.locationName}？`)) {
          return false;
        }
      }
    }
    let vehicles = this.vehicles && this.vehicles.map(m => m.vehicleId);
    this.form.patchValue({ vehicleId: vehicles });
    return super.onUpdate();
  }
}
