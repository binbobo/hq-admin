import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ProcurementItem, ProcurementService } from '../procurement.service';
import { FormHandle } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'hq-procurement-edit',
  templateUrl: './procurement-edit.component.html',
  styleUrls: ['./procurement-edit.component.css']
})
export class ProcurementEditComponent extends FormHandle<ProcurementItem> implements OnInit {

  protected getModel(): Observable<ProcurementItem> {
    return Observable.of(this.model);
  }

  protected buildForm(): FormGroup {
    return this.formBuilder.group({
      brandName: [this.model.brandName],
      productCode: [this.model.productCode, [Validators.required]],
      productName: [this.model.productName, [Validators.required]],
      productCategory: [this.model.productCategory],
      productId: [this.model.productId, [Validators.required, Validators.maxLength(36)]],
      productSpecification: [this.model.productSpecification],
      storeId: [this.model.storeId, [Validators.required, Validators.maxLength(36)]],
      locationId: [this.model.locationId, [Validators.maxLength(36)]],
      count: [this.model.count, [Validators.required, CustomValidators.min(1), CustomValidators.digits]],
      price: [this.model.price],
      yuan: [this.model.price / 100, [Validators.required, CustomValidators.gt(0)]],
      amount: [this.model.amount],
      exTaxPrice: [this.model.exTaxPrice],
      exTaxAmount: [this.model.exTaxAmount],
      locationName: [this.model.locationName],
      storeName: [this.model['storeName']],
      productUnit: [this.model.productUnit],
    })
  }

  constructor(
    private injector: Injector,
    private procurementService: ProcurementService,
  ) {
    super(injector, null);
  }

  protected onUpdate(event: Event) {
    let valid = this.validate();
    if (!valid) {
      event.preventDefault();
      return false;
    }
    this.onSubmit.emit(this.form.value);
  }

  onPriceChange(event) {
    let val = event.target.value || 0;
    let price = (val * 100).toFixed();
    this.form.controls['price'].setValue(price);
    this.calculate();
  }

  private calculate() {
    let count = this.form.controls['count'].value || 0;
    let price = this.form.controls['price'].value || 0;
    let tax = this.model.taxRate || 0;
    let exTaxPrice = (price / (tax * 0.01 + 1)).toFixed(0);
    let amount = count * price;
    let exTaxAmount = count * +exTaxPrice;
    this.form.patchValue({
      amount: amount,
      count: count,
      price: price,
      exTaxAmount: exTaxAmount,
      exTaxPrice: exTaxPrice
    });
  }
}
