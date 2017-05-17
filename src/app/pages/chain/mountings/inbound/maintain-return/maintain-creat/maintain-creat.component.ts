import { Component, OnInit, Injector, OnChanges, Output, EventEmitter, ViewChildren, QueryList, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { MaintainReturnListItem } from '../maintain-return.service';
import { Observable } from "rxjs/Rx";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormControlErrorDirective, TypeaheadRequestParams } from 'app/shared/directives';
import { CustomValidators } from 'ng2-validation';
import { CentToYuanPipe } from "app/shared/pipes";

@Component({
  selector: 'hq-maintain-creat',
  templateUrl: './maintain-creat.component.html',
  styleUrls: ['./maintain-creat.component.css']
})
export class MaintainCreatComponent implements OnInit, OnChanges {
  private form: FormGroup;
  private converter: CentToYuanPipe = new CentToYuanPipe();
  @Output()
  private formSubmit = new EventEmitter<MaintainReturnListItem>();
  private model: MaintainReturnListItem = new MaintainReturnListItem();
  @ViewChildren(FormControlErrorDirective)
  private controls: QueryList<FormControlErrorDirective>;
  constructor(
    private formBuilder: FormBuilder,
  ) {

  }

  ngOnInit() {
    this.buildForm();
    this.model.amount = this.inputData.amount - Number(this.model.initcount) * Number(this.inputData.price);
  }
  ngOnChanges(changes: SimpleChanges) {
    Object.assign(this.model, this.inputData);
  }
  @Input() inputData;


  private buildForm() {
    this.form = this.formBuilder.group({
      brand: [this.model.brand],
      productCode: [this.model.productCode],
      productName: [this.model.productName],
      productId: [this.model.productId],
      productSpecification: [this.model.productSpecification],
      storeId: [this.model.storeId],
      locationId: [this.model.locationId],
      initcount: [this.model.initcount, [Validators.required, CustomValidators.gt(0), CustomValidators.digits,]],
      price: [this.model.price, [Validators.required]],
      amount: [this.model.amount, [Validators.required]],
      locationName: [this.model.locationName],
      vihicleName: [this.model.vihicleName],
      serviceName: [this.model.serviceName, [Validators.required]],
      maintenanceItemId: [this.model.maintenanceItemId],
      takeUser: [this.model.takeUser],
      storeName: [this.model.storeName],
    })
  }

  public onSubmit(event: Event) {
    this.model.count = this.model.initcount;
    Object.assign(this.form.value, this.model);
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
    // this.form.reset();
  }

  public onChangeCount(evt) {
    evt.preventDefault();
    this.model.initcount = evt.target.value;
    this.model.amount = this.inputData.amount - Number(this.model.initcount) * Number(this.inputData.price);
  }





}
