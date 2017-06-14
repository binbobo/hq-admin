import { Component, OnInit, EventEmitter, Output, ViewChildren, QueryList, ViewChild, ElementRef, Injector } from '@angular/core';
import { TypeaheadRequestParams, FormGroupControlErrorDirective, HqAlerter } from 'app/shared/directives';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { CentToYuanPipe } from 'app/shared/pipes';
import { ProcurementItem, } from '../procurement.service';
import { SelectOption, FormHandle } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'hq-procurement-create',
  templateUrl: './procurement-create.component.html',
  styleUrls: ['./procurement-create.component.css']
})
export class ProcurementCreateComponent extends FormHandle<any> {

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
      yuan: [this.model['yuan'], [Validators.required, CustomValidators.gt(0)]],
      amount: [this.model.amount],
      exTaxPrice: [this.model.exTaxPrice],
      exTaxAmount: [this.model.exTaxAmount],
      locationName: [this.model.locationName, [Validators.required]],
      storeName: [this.model.houseName],
      productUnit: [this.model.productUnit],
    });
  }

  protected getModel(): Observable<any> {
    this.model = new ProcurementItem();
    this.model['yuan'] = this.model.price / 100;
    return Observable.of(this.model);
  }

  private storages: Array<any>;
  private locations: Array<any>;
  private isSelected: boolean;

  constructor(
    private injector: Injector,
  ) {
    super(injector, null);
  }

  private onResetForm(event: Event, key: string) {
    this.productNotExist = false;
    if (!event.isTrusted || !this.isSelected) return false;
    let obj = { ...this.model };
    key in obj && delete obj[key];
    this.form.patchValue(obj);
    this.storages = null;
    this.locations = null;
    this.isSelected = false;
  }

  private onEmpty(event) {
    event && (this.productNotExist = true);
  }

  private productNotExist: boolean;

  public submit(event: Event) {
    let valid = this.validate();
    if (!valid) return false;
    let value = { ...this.form.value, taxRate: this.model.taxRate };
    let obj = {
      data: value,
      continuable: !event,
    };
    this.onSubmit.emit(obj);
    this.reset();
  }

  onStorageChange(storageId: string) {
    let storage = this.storages.find(m => m.id === storageId);
    this.locations = storage && storage.locations;
    let location = this.locations && this.locations.length && this.locations[0];
    let count = location && location.count;
    this.form.patchValue({
      locationId: location && location.id,
      locationName: location && location.name,
    });
  }

  private onItemSelect(event) {
    this.isSelected = true;
    let item: any = {
      productUnit: event.unitName,
      productCode: event.code,
      productName: event.name,
      productSpecification: event.specification,
      productId: event.id,
      brandName: event.brandName,
      price: event.newPrice,
      yuan: event.newPrice / 100,
      taxRate: event.taxRate,
      productCategory: event.categoryName,
    }
    this.storages = event.storages;
    this.locations = null;
    if (Array.isArray(event.storages) && event.storages.length) {
      let storage = this.storages.find(m => m.locations && m.locations.length);
      storage = storage || this.storages[0];
      item.storeId = storage.id;
      item.storeName = storage.name;
      this.onStorageChange(storage.id);
    } else {
      item.locationId = null;
    }
    this.form.patchValue(item);
    this.calculate();
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

  private reset() {
    this.storages = null;
    this.locations = null;
    super.onReset();
  }
}