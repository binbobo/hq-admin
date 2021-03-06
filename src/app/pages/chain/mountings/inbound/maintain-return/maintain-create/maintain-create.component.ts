import { Component, OnInit, Injector, OnChanges, Output, EventEmitter, ViewChildren, QueryList, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { MaintainReturnListItem } from '../maintain-return.service';
import { Observable } from "rxjs/Rx";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormGroupControlErrorDirective, TypeaheadRequestParams, HqAlerter } from 'app/shared/directives';
import { CustomValidators } from 'ng2-validation';
import { CentToYuanPipe } from "app/shared/pipes";

@Component({
  selector: 'hq-maintain-create',
  templateUrl: './maintain-create.component.html',
  styleUrls: ['./maintain-create.component.css']
})
export class MaintainCreateComponent implements OnInit, OnChanges {
  private form: FormGroup;
  private converter: CentToYuanPipe = new CentToYuanPipe();
  @Output()
  private formSubmit = new EventEmitter<MaintainReturnListItem>();
  private model: MaintainReturnListItem = new MaintainReturnListItem();
  @ViewChildren(FormGroupControlErrorDirective)
  private controls: QueryList<FormGroupControlErrorDirective>;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  constructor(
    private formBuilder: FormBuilder,
  ) {

  }
  public initamount: any;
  ngOnInit() {
    this.model.initamount = 1 * Number(this.inputData.price);
    this.buildForm();
  }
  ngOnChanges(changes: SimpleChanges) {
    Object.assign(this.model, this.inputData);
  }
  @Input() inputData;

  private buildForm() {
    this.form = this.formBuilder.group({
      brandName: [this.model.brandName],
      productCode: [this.model.productCode],
      productName: [this.model.productName],
      productId: [this.model.productId],
      productSpecification: [this.model.productSpecification],
      storeId: [this.model.storeId],
      locationId: [this.model.locationId],
      initcount: [this.model.initcount, [Validators.required, CustomValidators.gt(0), CustomValidators.digits]],
      count: [this.model.count],
      price: [this.model.price, [Validators.required]],
      amount: [this.model.amount, [Validators.required]],
      initamount: [this.model.initamount, [Validators.required]],
      locationName: [this.model.locationName],
      vehicleInfoList: [this.model.vehicleInfoList],
      serviceName: [this.model.serviceName, [Validators.required]],
      maintenanceItemId: [this.model.maintenanceItemId],
      takeUser: [this.model.takeUser],
      storeName: [this.model.storeName],
      operatorId: [this.model.operatorId],
      createUser: [this.model.createUser],
      description: [this.model.description],
      productCategory:[this.model.productCategory],
      productUnit:[this.model.productUnit]
    })
  }

  public onSubmit(event: Event) {
    this.model.count = this.model.initcount;
    this.model.amount = this.model.initamount;
    this.model.createUser = this.model.operatorId;
    Object.assign(this.form.value, this.model);

    if (this.model.count > (this.inputData.count - this.inputData.returnCount)) {
      this.alerter.error("数量不能高于当前可退数量，请重新填写", true, 3000);
      return false;
    }
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
    this.model.initamount = Number(this.model.initcount) * Number(this.inputData.price);
  }





}
