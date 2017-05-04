import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle, SelectOption } from 'app/shared/models';
import { Inventory, InventoryService } from '../inventory.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators } from '@angular/forms';
import { MountingsService } from '../../../mountings/mountings.service';

@Component({
  selector: 'hq-inventory-create',
  templateUrl: './inventory-create.component.html',
  styleUrls: ['./inventory-create.component.css']
})
export class InventoryCreateComponent extends FormHandle<Inventory> implements OnInit {

  private warehouses: Array<SelectOption>;

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
      vehicleName: [this.model.vehicleName, [Validators.required, Validators.maxLength(30)]],
      unit: [this.model.unit, [Validators.required, Validators.maxLength(20)]],
      brand: [this.model.brand, [Validators.required, Validators.maxLength(50)]],
      categoryName: [this.model.category, [Validators.maxLength(60)]],
      code: [this.model.code, [Validators.required, Validators.maxLength(36)]],
      name: [this.model.name, [Validators.required, Validators.maxLength(60)]],
      maxCount: [this.model.maxCount],
      minCount: [this.model.minCount],
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
      .then(id => this.form.patchValue({ storeId: id }))
      .catch(err => this.alerter.warn(err));
  }

}
