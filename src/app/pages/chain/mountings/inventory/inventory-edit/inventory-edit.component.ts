import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle, SelectOption } from 'app/shared/models';
import { Inventory, InventoryService } from '../inventory.service';
import { MountingsService } from '../../../mountings/mountings.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators } from '@angular/forms';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { TreeviewItem } from 'ngx-treeview';
import { ActivatedRoute } from '@angular/router';
import { TypeaheadRequestParams } from 'app/shared/directives';

@Component({
  selector: 'hq-inventory-edit',
  templateUrl: './inventory-edit.component.html',
  styleUrls: ['./inventory-edit.component.css']
})
export class InventoryEditComponent extends FormHandle<Inventory> implements OnInit {

  private brands: Array<SelectOption>;
  private units: Array<SelectOption>;

  constructor(
    injector: Injector,
    service: InventoryService,
    private moutingsService: MountingsService,
  ) {
    super(injector, service);
  }

  protected getModel(): Observable<Inventory> {
    return Observable.of(this.model)
  }
  protected buidForm(): FormGroup {
    return this.formBuilder.group({
      unit: [this.model.unit, [Validators.required, Validators.maxLength(36)]],
      locationName: [this.model.locationName, [Validators.maxLength(50)]],
      brandName: [this.model.brandName, [Validators.required, Validators.maxLength(50)]],
      maxCount: [this.model.maxCount],
      minCount: [this.model.minCount],
      brandId: [this.model.brandId],
      storeId: [this.model.storeId],
      id: [this.model.id],
      vehicleId: [this.model.vehicleId],
      description: [this.model.description, [Validators.maxLength(200)]],
    });
  }

  ngOnInit() {
    super.ngOnInit();
    this.moutingsService.getBrands()
      .then(options => this.brands = options)
      .catch(err => this.alerter.warn(err));
    this.moutingsService.getUnitOptions()
      .then(options => this.units = options)
      .catch(err => this.alerter.warn(err));
    if (Array.isArray(this.model.vehicleList)) {
      this.vehicles = this.model.vehicleList.map(v => ({ id: v.vehicleId, name: v.vehicleName }));
    }
  }

  public vehicles: Array<any> = [];

  onVehicleSelect(event) {
    let index = this.vehicles.findIndex(m => m.id === event.id);
    if (event.checked && !~index) {
      this.vehicles.push(event);
    } else if (!event.checked && ~index) {
      this.vehicles.splice(index, 1);
    }
  }

  public get vehicleCheckStrategy() {
    return (item) => this.vehicles.some(m => m.id && m.id === item.id);
  }


  onBrandSelect(event: TypeaheadMatch) {
    this.form.patchValue({ brandId: event.item.value });
  }

  onBrandChange(event: Event) {
    this.form.patchValue({ brandId: undefined });
  }

  protected onUpdate() {
    let vehicles = this.vehicles.map(m => m.id);
    this.form.patchValue({ vehicleId: vehicles });
    return super.onUpdate();
  }

}
