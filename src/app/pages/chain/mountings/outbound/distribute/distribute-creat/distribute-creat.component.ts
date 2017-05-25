import { Component, OnInit, Injector, OnChanges, Output, EventEmitter, ViewChildren, QueryList, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { DistributeListItem, DistributeService } from '../distribute.service';
import { Observable } from "rxjs/Rx";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormGroupControlErrorDirective, TypeaheadRequestParams, HqAlerter, PrintDirective } from 'app/shared/directives';
import { GetMountingsListRequest, MountingsService } from '../../../mountings.service';
import { CustomValidators } from 'ng2-validation';
import { CentToYuanPipe } from "app/shared/pipes";


@Component({
  selector: 'hq-distribute-creat',
  templateUrl: './distribute-creat.component.html',
  styleUrls: ['./distribute-creat.component.css']
})
export class DistributeCreatComponent implements OnInit {
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
    private moutingsService: MountingsService,
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
    console.log(evt)
    let creatAry = [];
    creatAry = this.InputData.employeesData.filter(item => item.id === evt.target.value);
    console.log(creatAry)
    this.model.createUserName = creatAry[0].name;
    this.model.createUser = creatAry[0].id;
    console.log(this.model, this.form.value)
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
    let validators = Validators.compose([countControl.validator, CustomValidators.max(count)])
    countControl.setValidators(validators);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      brandName: [this.model.brand, [Validators.required]],
      productCode: [this.model.productCode],
      productName: [this.model.productName],
      productCategory: [this.model.productCategory],
      productId: [this.model.productId, [Validators.required, Validators.maxLength(36)]],
      productSpecification: [this.model.productSpecification, [Validators.required]],
      storeId: [this.model.storeId],
      locationId: [this.model.locationId],
      ProductUnit: [this.model.ProductUnit],
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
      description: [this.model.description]
    })

  }

  public onSubmit(event: Event) {
    console.log(this.form.value, event, this.model)
this.form.value["createUserName"]=this.model["createUserName"];
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
    }
  }

  public onReset() {
    this.form = null;
    setTimeout(() => this.buildForm(), 1);
    return false;
  }

  private onResetForm(event: Event) {
    if (!event.isTrusted) return false;
    this.storages = null;
    this.locations = null;
    let obj = { ...this.model };
    delete obj.storeId;
    delete obj.locationId;
    this.form.patchValue(obj);
  }

  public onItemSelect(event) {
    console.log(event)
    let item: any = {
      ProductUnit: event.unitName,
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
    let validators = Validators.compose([priceControl.validator, CustomValidators.min(item.price / 100)])
    priceControl.setValidators(validators);
    setTimeout(() => {
      this.form.patchValue(item);
      this.calculate();
    }, 1);
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
