import { Component, OnInit, EventEmitter, Output, ViewChildren, QueryList, ViewChild, ElementRef } from '@angular/core';
import { TypeaheadRequestParams, FormGroupControlErrorDirective, HqAlerter } from 'app/shared/directives';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { CentToYuanPipe } from 'app/shared/pipes';
import { ProcurementService, ProcurementItem, GetProductsRequest } from '../procurement.service';
import { MountingsService } from '../../../mountings.service';
import { SelectOption } from 'app/shared/models';

@Component({
  selector: 'hq-procurement-create',
  templateUrl: './procurement-create.component.html',
  styleUrls: ['./procurement-create.component.css']
})
export class ProcurementCreateComponent implements OnInit {

  private form: FormGroup;
  private converter: CentToYuanPipe = new CentToYuanPipe();
  @Output()
  private formSubmit = new EventEmitter<ProcurementItem>();
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  private model: ProcurementItem = new ProcurementItem();
  @ViewChildren(FormGroupControlErrorDirective)
  private controls: QueryList<FormGroupControlErrorDirective>;
  private warehouses: Array<SelectOption>;

  constructor(
    private el: ElementRef,
    private formBuilder: FormBuilder,
    private procurementService: ProcurementService,
    private moutingsService: MountingsService,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.moutingsService.getWarehouseOptions()
      .then(options => this.warehouses = options)
      .then(options => options.length ? options[0].value : '')
      .then(id => {
        this.form.controls['storeId'].setValue(id);
        this.model.storeId = id;
      })
      .catch(err => this.alerter.error(err))
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      brandName: [this.model.brandName],
      productCode: [this.model.productCode],
      productName: [this.model.productName],
      productCategory: [this.model.productCategory],
      productId: [this.model.productId, [Validators.required, Validators.maxLength(36)]],
      productSpecification: [this.model.productSpecification],
      storeId: [this.model.storeId, [Validators.required, Validators.maxLength(36)]],
      locationId: [this.model.locationId],
      count: [this.model.count, [Validators.required, CustomValidators.min(1), CustomValidators.digits]],
      price: [this.model.price],
      yuan: [this.model.price / 100, [Validators.required, CustomValidators.gt(0)]],
      amount: [this.model.amount],
      exTaxPrice: [this.model.exTaxPrice],
      exTaxAmount: [this.model.exTaxAmount],
      locationName: [this.model.locationName, [Validators.required]],
      storeName: [this.model.houseName, [Validators.required]],
      unit: [this.model.unit],
    })
  }

  get typeaheadParams() {
    return { storeId: this.form.get('storeId').value };
  }

  private onResetForm(event: Event, key: string) {
    if (!event.isTrusted) return false;
    let obj = { ...this.model, yuan: 0 };
    key in obj && delete obj[key];
    this.form.patchValue(obj);
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
      let storageId = this.form.get('storeId').value;
      let storage = formData.storeId && this.warehouses.find(m => m.value === formData.storeId);
      let value = { ...formData, storeName: storage && storage.text };
      this.formSubmit.emit(value);
    }
  }

  onLocationChange(event: Event) {
    if (event.isTrusted) {
      this.form.patchValue({ locationId: undefined });
    }
  }

  onLocationSelect(event) {
    this.form.patchValue({ locationId: event.id });
  }

  onStorageChange(event) {
    this.form.patchValue({ locationName: undefined, locationId: undefined });
  }

  public onReset() {
    this.form = null;
    setTimeout(() => this.buildForm(), 1);
    return false;
  }

  private onItemSelect(event) {
    let item: any = {
      unit: event.unitName,
      productCode: event.code,
      productName: event.name,
      productSpecification: event.specification,
      productId: event.id,
      brandName: event.brandName,
      stockCount: event.count,
      price: event.newPrice,
      yuan: event.newPrice / 100,
      taxRate: event.taxRate,
      productCategory: event.categoryName,
    }
    if (Array.isArray(event.storages)) {
      let storage = event.storages.find(m => m.locations && m.locations.length && this.warehouses.some(w => w.value === m.id));
      if (storage) {
        let location = storage.locations[0];
        item.storeId = storage.id;
        item.locationId = location.id;
        item.locationName = location.name;
      }
    }
    this.form.patchValue(item);
    this.calculate();
  }

  get editable() {
    return this.form.controls['productId'].value ? true : undefined;
  }

  onPriceChange(event) {
    let val = event.target.value || 0;
    let price = Math.floor(val * 100);
    this.form.controls['price'].setValue(price);
    this.calculate();
  }

  private calculate() {
    let count = this.form.controls['count'].value || 0;
    let price = this.form.controls['price'].value || 0;
    let tax = this.model.taxRate || 0;
    let exTaxPrice = Math.floor(price / (tax * 0.01 + 1));
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