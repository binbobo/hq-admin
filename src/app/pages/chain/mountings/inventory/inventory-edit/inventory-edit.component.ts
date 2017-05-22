import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { Inventory, InventoryService } from '../inventory.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators } from '@angular/forms';

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
      locationName: [this.model.locationName, [Validators.maxLength(50)]],
      maxCount: [this.model.maxCount],
      minCount: [this.model.minCount],
      description: [this.model.description, [Validators.maxLength(200)]],
    });
  }

  ngOnInit() {
    super.ngOnInit();
    if (Array.isArray(this.model.vehicleList)) {
      this.vehicles = this.model.vehicleList.map(v => ({ id: v.vehicleId, name: v.vehicleName }));
    }
  }
}
