import { Component, Injector, } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { Observable } from "rxjs/Rx";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { ReceiveListItem } from '../receive.service';

@Component({
  selector: 'hq-receive-create',
  templateUrl: './receive-create.component.html',
  styleUrls: ['./receive-create.component.css']
})
export class ReceiveCreateComponent extends FormHandle<any> {

  protected buildForm(): FormGroup {
    return this.formBuilder.group({
      brandName: [this.model.brand, [Validators.required]],
      productCode: [this.model.productCode],
      productName: [this.model.productName],
      productCategory: [this.model.productCategory, [Validators.required]],
      productId: [this.model.productId, [Validators.required, Validators.maxLength(36)]],
      productSpecification: [this.model.productSpecification, [Validators.required]],
      storeId: [this.model.storeId],
      locationId: [this.model.locationId],
      productUnit: [this.model.productUnit],
      count: [this.model.count, [Validators.required, CustomValidators.min(1)]],
      price: [this.model.price],
      amount: [this.model.amount],
      stockCount: [this.model.stockCount, [CustomValidators.min(1)]],
      yuan: [this.model['yuan'], [Validators.required, CustomValidators.gt(0)]]
    })
  }

  protected getModel(): Observable<any> {
    this.model = new ReceiveListItem();
    this.model['yuan'] = this.model.price / 100;
    return Observable.of(this.model);
  }

  private storages: Array<any>;
  private locations: Array<any>;

  constructor(
    private injector: Injector,
  ) {
    super(injector, null);
  }

  onPriceChange(event) {
    let val = event.target.value || 0;
    let price = (val * 100).toFixed();
    this.form.patchValue({ price: price });
    this.calculate();
  }

  onStorageChange(storageId: string) {
    let storage = this.storages.find(m => m.id === storageId);
    this.locations = storage && storage.locations;
    let location = this.locations && this.locations.length && this.locations[0];
    let count = location && location.count;
    this.form.patchValue({
      locationId: location && location.id,
      stockCount: count,
    });
    this.onLocationChange(location && location.id);
  }

  onLocationChange(locationId: string) {
    let location = this.locations && this.locations.find(m => m.id === locationId);
    let stock = location && location.count || 0;
    this.form.controls['stockCount'].setValue(stock);
    let countControl = this.form.controls['count'];
    let validators = Validators.compose([Validators.required, CustomValidators.min(1), CustomValidators.max(stock)])
    countControl.setValidators(validators);
    countControl.updateValueAndValidity();
  }

  public submit(event: Event) {
    let valid = this.validate();
    if (!valid) return false;
    let formData = this.form.value;
    let location = formData.locationId && this.locations.find(m => m.id === formData.locationId);
    let storageId = this.form.get('storeId').value;
    let storage = formData.storeId && this.storages.find(m => m.id === formData.storeId);
    let value = { ...formData, locationName: location && location.name, houseName: storage && storage.name };
    let obj = { data: value, continuable: !event };
    this.onSubmit.emit(obj);
    this.reset();
  }

  private onResetForm(event: any, retainKey: string) {
    if (!event.isTrusted) return false;
    this.storages = null;
    this.locations = null;
    Object.keys(this.form.controls)
      .forEach(key => key !== retainKey && this.form.get(key).setValue(this.model[key]));
  }

  public onItemSelect(event) {
    let item: any = {
      productUnit: event.unitName,
      productId: event.id,
      productCode: event.code,
      productName: event.name,
      productSpecification: event.specification,
      brandName: event.brandName,
      productCategory: event.categoryName,
      storeId: null,
      price: event.price,
      yuan: (event.price || 0) / 100
    }
    this.storages = event.storages;
    this.locations = null;
    if (Array.isArray(event.storages) && event.storages.length) {
      let storage = this.storages.find(m => m.locations && m.locations.length);
      storage = storage || this.storages[0];
      item.storeId = storage.id;
      this.onStorageChange(storage.id);
    } else {
      item.locationId = null;
      item.stockCount = 0;
    }
    let priceControl = this.form.controls['yuan'];
    this.price = event.newPrice / 100;
    let validators = Validators.compose([Validators.required, CustomValidators.gt(0), CustomValidators.min(this.price)]);
    priceControl.setValidators(validators);
    this.form.patchValue(item);
    this.calculate();
    this.form.updateValueAndValidity();
  }

  private price = 0;

  get priceError() {
    return { min: `最低价格不能低于${this.price}` };
  }

  private calculate() {
    let count = this.form.controls['count'].value;
    let price = this.form.controls['price'].value;
    count = Math.floor(count || 0);
    price = Math.floor(price || 0);
    let amount = (count || 0) * (price || 0);
    this.form.patchValue({ amount: amount, count: count, price: price });
  }

  private reset() {
    this.storages = null;
    this.locations = null;
    super.onReset();
  }

}
