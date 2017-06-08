import { Component, OnInit, Injector, OnChanges, Output, EventEmitter, ViewChildren, QueryList, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { DistributeListItem, DistributeService } from '../distribute.service';
import { Observable } from "rxjs/Rx";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormGroupControlErrorDirective, TypeaheadRequestParams, HqAlerter, PrintDirective } from 'app/shared/directives';
import { CustomValidators } from 'ng2-validation';
import { CentToYuanPipe } from "app/shared/pipes";


@Component({
  selector: 'hq-distribute-create',
  templateUrl: './distribute-create.component.html',
  styleUrls: ['./distribute-create.component.css']
})
export class DistributeCreateComponent implements OnInit {
  private form: FormGroup;
  private converter: CentToYuanPipe = new CentToYuanPipe();
  @Output()
  private formSubmit = new EventEmitter<DistributeListItem>();
  private model: DistributeListItem = new DistributeListItem();
  @ViewChildren(FormGroupControlErrorDirective)
  private controls: QueryList<FormGroupControlErrorDirective>;
  private storages: Array<any>;
  private locations: Array<any>;

  constructor(
    private formBuilder: FormBuilder,
  ) { }
  @Input()
  InputData;
  ngOnInit() {
    this.buildForm();
    this.form.patchValue(this.InputData);
    Object.assign(this.model, this.InputData);
    this.model.createUser = this.InputData.employeesData[0].id;
    this.model.createUserName = this.InputData.employeesData[0].name;
    this.form.controls.createUser.setValue(this.InputData.employeesData[0].id)
  }
  onSellerSelect(evt) {
    let creatAry = [];
    creatAry = this.InputData.employeesData.filter(item => item.id === evt.target.value);
    this.model.createUserName = creatAry[0].name;
    this.model.createUser = creatAry[0].id;
    this.form.value["createUserName"] = this.model.createUserName;
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
    let countControl = this.form.controls['count'];
    let validators = Validators.compose([Validators.required, CustomValidators.min(1), CustomValidators.max(count)])
    countControl.setValidators(validators);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      brandName: [this.model.brand],
      productCode: [this.model.productCode],
      productName: [this.model.productName],
      productCategory: [this.model.productCategory],
      productId: [this.model.productId, [Validators.required]],
      productSpecification: [this.model.productSpecification],
      storeId: [this.model.storeId],
      locationId: [this.model.locationId],
      productUnit: [this.model.productUnit],
      count: [this.model.count, [Validators.required, CustomValidators.min(1)]],
      price: [this.model.price],
      amount: [this.model.amount],
      stockCount: [this.model.stockCount, [CustomValidators.min(1)]],
      yuan: [this.model.price / 100, [Validators.required, CustomValidators.gt(0)]],
      createUser: [this.model.createUser, [Validators.required]],
      createUserName: [this.model.createUserName],
      serviceName: [this.model.serviceName],
      maintenanceItemId: [this.model.maintenanceItemId],
      vihicleName: [this.model.vihicleName],
      description: [this.model.description],
      vehicleInfoList: [this.vehicleInfoList]
    })

  }

  public onSubmit(event: Event) {
    this.form.value["createUserName"] = this.model["createUserName"];
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
      let value = { ...formData, locationName: location && location.name, storeName: storage && storage.name };
      Object.assign(this.form.value, this.model);
      this.formSubmit.emit(value);
      this.onReset();
    }
  }

  public onReset() {
    this.storages = null;
    this.locations = null;
    this.form.reset({ ...this.model, yuan: this.model.price / 100 });
  }

  private onResetForm(event: Event, key: string) {
    if (!event.isTrusted) return false;
    this.storages = null;
    this.locations = null;
    this.vehicleInfoList = null;
    let obj = { ...this.model };
    key in obj && delete obj[key];
    this.form.patchValue(obj);
  }

  vehicleInfoList: any;
  public onItemSelect(event) {
    let item: any = {
      productUnit: event.unitName,
      productId: event.id,
      productCode: event.code,
      productName: event.name,
      productSpecification: event.specification,
      brandName: event.brandName,
      productCategory: event.categoryName,
      vihicleName: event.vehicleName,
      description: event.description,
      storeId: null,
      price: event.price,
      newPrice: event.newPrice,
      yuan: (event.price || 0) / 100,
      vehicleInfoList: event.vehicleInfoList
    }
    this.vehicleInfoList = item.vehicleInfoList;
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
    let validators = Validators.compose([Validators.required, CustomValidators.gt(0), CustomValidators.min(item.newPrice / 100)])
    priceControl.setValidators(validators);
    setTimeout(() => {
      this.form.patchValue(item);
      this.calculate();
    }, 1);
  }
  private calculate() {
    let count = this.form.controls['count'].value;
    let price = this.form.controls['price'].value;
    count = Math.floor(count || 1);
    price = Math.floor(price || 0);
    let amount = (count || 1) * (price || 0);
    this.form.patchValue({ amount: amount, count: count, price: price });
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

}
