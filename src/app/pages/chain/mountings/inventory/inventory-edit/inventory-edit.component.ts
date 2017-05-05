import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle, SelectOption } from 'app/shared/models';
import { Inventory, InventoryService } from '../inventory.service';
import { MountingsService } from '../../../mountings/mountings.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators } from '@angular/forms';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { TreeviewItem } from 'ngx-treeview';
import { ActivatedRoute } from '@angular/router';

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
      id: [this.model.id],
      description: [this.model.description, [Validators.maxLength(200)]],
    });
  }

  ngOnInit() {
    console.log(this.model);
    super.ngOnInit();
    this.moutingsService.getBrands()
      .then(options => this.brands = options)
      .catch(err => this.alerter.warn(err));
    this.moutingsService.getUnitOptions()
      .then(options => this.units = options)
      .catch(err => this.alerter.warn(err));
  }

  onBrandSelect(event: TypeaheadMatch) {
    this.form.patchValue({ brandId: event.item.value });
  }

  onBrandChange(event: Event) {
    this.form.patchValue({ brandId: undefined });
  }

}
