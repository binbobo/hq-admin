import { Component, OnInit, Injector, OnChanges, Output, EventEmitter, ViewChildren, QueryList, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { MaintainReturnListItem } from '../maintain-return.service';
import { Observable } from "rxjs/Rx";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormControlErrorDirective, TypeaheadRequestParams } from 'app/shared/directives';
import { GetMountingsListRequest, MountingsService } from '../../../mountings.service';
import { CustomValidators } from 'ng2-validation';
import { CentToYuanPipe } from "app/shared/pipes";

@Component({
  selector: 'hq-maintain-creat',
  templateUrl: './maintain-creat.component.html',
  styleUrls: ['./maintain-creat.component.css']
})
export class MaintainCreatComponent implements OnInit {
  private form: FormGroup;
  private converter: CentToYuanPipe = new CentToYuanPipe();
  @Output()
  private formSubmit = new EventEmitter<MaintainReturnListItem>();
  private model: MaintainReturnListItem = new MaintainReturnListItem();
  @ViewChildren(FormControlErrorDirective)
  private controls: QueryList<FormControlErrorDirective>;
  @ViewChild('priceControl')
  private priceControl: FormControlErrorDirective
  private price: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private moutingsService: MountingsService,
  ) {

  }

  ngOnInit() {
    this.buildForm();
  }

  @Input() inputData;

  private buildForm() {
    this.form = this.formBuilder.group({
      brand: [this.model.brand, [Validators.required]],
      productCode: [this.model.productCode],
      productName: [this.model.productName],
      productId: [this.model.productId],
      productSpecification: [this.model.productSpecification],
      storeId: [this.model.storeId],
      locationId: [this.model.locationId],
      count: [this.model.count, [Validators.required, CustomValidators.digits]],
      price: [this.model.price],
      amount: [this.model.amount],
      locationName: [this.model.locationName],
      houseName: [this.model.houseName],
      vihicleName: [this.model.vihicleName],
      serviceName: [this.model.serviceName],
      maintenanceItemId: [this.model.maintenanceItemId],
      takeUser: [this.model.takeUser]
    })
  }

  public onSubmit(event: Event) {
    console.log(this.model);
    let invalid = this.controls
      .map(c => c.validate())
      .some(m => !m);
    if (invalid) {
      event.preventDefault();
      return false;
    } else {
      this.formSubmit.emit(this.form.value);
      this.form.reset(this.model);
    }
  }

  public onReset() {
    this.form = null;
    setTimeout(() => this.buildForm(), 1);
    return false;
  }

  public onChangeCount() {
    
  }




}
