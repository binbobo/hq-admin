import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle, SelectOption } from 'app/shared/models';
import { Inventory, InventoryService } from '../inventory.service';
import { MountingsService } from '../../../mountings/mountings.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'hq-inventory-edit',
  templateUrl: './inventory-edit.component.html',
  styleUrls: ['./inventory-edit.component.css']
})
export class InventoryEditComponent extends FormHandle<Inventory> implements OnInit {

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
      storeId: [{ value: this.model.storeId, disabled: true }, [Validators.required, Validators.maxLength(36)]],
      vehicleName: [{ value: this.model.vehicleName, disabled: true }, [Validators.required, Validators.maxLength(30)]],
      unit: [this.model.unit, [Validators.required, Validators.maxLength(36)]],
      brandName: [this.model.brandName, [Validators.required, Validators.maxLength(50)]],
      categoryId: [this.model.categoryId, [Validators.maxLength(36)]],
      code: [{ value: this.model.code, disabled: true }, [Validators.required, Validators.maxLength(36)]],
      name: [{ value: this.model.name, disabled: true }, [Validators.required, Validators.maxLength(60)]],
      maxCount: [this.model.maxCount],
      minCount: [this.model.minCount],
      packageInfo: [{ value: this.model.packageInfo, disabled: true }, [Validators.maxLength(20)]],
      madeIn: [{ value: this.model.madeIn, disabled: true }, [Validators.maxLength(100)]],
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
