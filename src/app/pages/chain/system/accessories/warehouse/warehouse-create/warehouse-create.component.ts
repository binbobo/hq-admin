import { Component, OnInit, Injector } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { WarehouseService, Warehouse } from '../warehouse.service';
import { Observable } from 'rxjs/Observable';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'hq-warehouse-create',
  templateUrl: './warehouse-create.component.html',
  styleUrls: ['./warehouse-create.component.css']
})
export class WarehouseCreateComponent extends FormHandle<Warehouse> implements OnInit {

  constructor(
    injector: Injector,
    service: WarehouseService,
  ) {
    super(injector, service);
  }

  protected getModel(): Observable<Warehouse> {
    return Observable.of(new Warehouse());
  }

  protected buidForm(): FormGroup {
    return this.formBuilder.group({
      id: [this.model.id],
      code: [this.model.code, [Validators.required, Validators.maxLength(50)]],
      name: [this.model.name, [Validators.required, Validators.maxLength(100),]],
      description: [this.model.description, [Validators.maxLength(100)]]
    });
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
