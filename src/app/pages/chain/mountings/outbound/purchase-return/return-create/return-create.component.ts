import { Component, Injector } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { PurchaseReturnItem } from '../purchase-return.service';
import { FormHandle } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'hq-return-create',
  templateUrl: './return-create.component.html',
  styleUrls: ['./return-create.component.css'],
})
export class ReturnCreateComponent extends FormHandle<any> {

  protected buildForm(): FormGroup {
    return this.formBuilder.group({
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

  protected getModel(): Observable<any> {
    return Observable.of(this.model);
  }

  constructor(
    private injector: Injector,
  ) {
    super(injector, null);
  }

  public submit(event: Event) {
    let valid = this.validate();
    if (!valid) return false;
    let value = Object.assign({}, this.model, this.form.value);
    let obj = {
      data: value,
      continuable: !event,
    };
    this.onSubmit.emit(obj);
    this.form.reset(this.model);
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
}
