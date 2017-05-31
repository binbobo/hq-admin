import { Component, OnInit, Injector, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { SalesListItem } from '../sales.service';
import { Observable } from "rxjs/Rx";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TypeaheadRequestParams, FormGroupControlErrorDirective } from 'app/shared/directives';
import { CustomValidators } from 'ng2-validation';
import { CentToYuanPipe } from "app/shared/pipes";

@Component({
  selector: 'hq-sales-create',
  templateUrl: './sales-create.component.html',
  styleUrls: ['./sales-create.component.css']
})
export class SalesCreateComponent implements OnInit {

  private form: FormGroup;
  private converter: CentToYuanPipe = new CentToYuanPipe();
  @Output()
  private formSubmit = new EventEmitter<SalesListItem>();
  private model: SalesListItem = new SalesListItem();
  @ViewChildren(FormGroupControlErrorDirective)
  private controls: QueryList<FormGroupControlErrorDirective>;
  private storages: Array<any>;
  private locations: Array<any>;

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
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

  private buildForm() {
    this.form = this.formBuilder.group({
      brandName: [this.model.brand, [Validators.required]],
      productCode: [this.model.productCode],
      productName: [this.model.productName],
      productCategory: [this.model.productCategory, [Validators.required]],
      productId: [this.model.productId, [Validators.required, Validators.maxLength(36)]],
      productSpecification: [this.model.productSpecification, [Validators.required]],
      storeId: [this.model.storeId],
      locationId: [this.model.locationId],
      unit: [this.model.unit],
      count: [this.model.count, [Validators.required, CustomValidators.min(1)]],
      price: [this.model.price],
      amount: [this.model.amount],
      stockCount: [this.model.stockCount, [CustomValidators.min(1)]],
      yuan: [this.model.price / 100, [Validators.required, CustomValidators.gt(0)]]
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
      let formData = this.form.value;
      let location = formData.locationId && this.locations.find(m => m.id === formData.locationId);
      let storageId = this.form.get('storeId').value;
      let storage = formData.storeId && this.storages.find(m => m.id === formData.storeId);
      let value = { ...formData, locationName: location && location.name, houseName: storage && storage.name };
      this.formSubmit.emit(value);
    }
  }

  private onResetForm(event: Event, key: string) {
    if (!event.isTrusted) return false;
    this.storages = null;
    this.locations = null;
    let obj = { ...this.model };
    obj[key] = this.form.get(key).value;
    this.form.reset(obj);
  }

  public onItemSelect(event) {
    let item: any = {
      unit: event.unitName,
      productId: event.id,
      productCode: event.code,
      productName: event.name,
      productSpecification: event.specification,
      brandName: event.brandName,
      productCategory: event.categoryName,
      storeId: null,
      price: event.newPrice,
      yuan: (event.newPrice || 0) / 100
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
    this.price = item.price / 100;
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

}
