import { Component, OnInit, EventEmitter, Output, ViewChildren, QueryList, Input } from '@angular/core';
import { TypeaheadRequestParams, FormGroupControlErrorDirective, } from 'app/shared/directives';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { PurchaseReturnItem, PurchaseReturnService, GetProductsRequest } from '../purchase-return.service';

@Component({
  selector: 'hq-return-create',
  templateUrl: './return-create.component.html',
  styleUrls: ['./return-create.component.css'],
})
export class ReturnCreateComponent implements OnInit {

  private form: FormGroup;
  @Output()
  private submit = new EventEmitter<PurchaseReturnItem>();
  @Input()
  private model: PurchaseReturnItem;
  @ViewChildren(FormGroupControlErrorDirective)
  private controls: QueryList<FormGroupControlErrorDirective>;

  constructor(
    private formBuilder: FormBuilder,
    private returnService: PurchaseReturnService,
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      originalId: [this.model['id']],
      brand: [this.model.brand],
      productCode: [this.model.productCode],
      productName: [this.model.productName],
      productCategory: [this.model.productCategory],
      productId: [this.model.productId, [Validators.required, Validators.maxLength(36)]],
      specification: [this.model.specification],
      count: [this.model.count, [Validators.required, CustomValidators.digits, CustomValidators.min(1), CustomValidators.max(this.model.count)]],
      price: [this.model.price],
      amount: [this.model.amount],
      exTaxPrice: [this.model.exTaxPrice],
      exTaxAmount: [this.model.exTaxAmount],
      locationName: [this.model.locationName, [Validators.required]],
      storeName: [this.model.storeName, [Validators.required]],
    })
  }

  public onSubmit(event: Event) {
    let invalid = this.controls
      .map(c => c.validate())
      .some(m => !m);
    if (invalid) {
      event.preventDefault();
      return false;
    } else {
      let value = Object.assign({}, this.model, this.form.value);
      this.submit.emit(value);
      this.form.reset(this.model);
      this.onReset();
    }
  }

  private calculate() {
    let count = this.form.controls['count'].value || 0;
    let price = this.form.controls['price'].value || 0;
    let exTaxPrice = this.form.controls['exTaxPrice'].value || 0;
    let amount = count * price;
    let exTaxAmount = count * exTaxPrice;
    this.form.patchValue({
      amount: amount,
      count: count,
      price: price,
      exTaxAmount: exTaxAmount,
      exTaxPrice: exTaxPrice
    });
  }
  public onReset() {
    this.form = null;
    setTimeout(() => this.buildForm(), 1);
    return false;
  }

}
