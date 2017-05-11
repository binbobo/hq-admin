import { Component, OnInit, Injector, OnChanges, Output, EventEmitter, ViewChildren, QueryList, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { DistributeListItem } from '../distribute.service';
import { Observable } from "rxjs/Rx";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormControlErrorDirective, TypeaheadRequestParams } from 'app/shared/directives';
import { GetMountingsListRequest, MountingsService } from '../../../mountings.service';
import { CustomValidators } from 'ng2-validation';
import { CentToYuanPipe } from "app/shared/pipes";


@Component({
  selector: 'hq-distribute-creat',
  templateUrl: './distribute-creat.component.html',
  styleUrls: ['./distribute-creat.component.css']
})
export class DistributeCreatComponent implements OnInit, OnChanges {

  private form: FormGroup;
  private converter: CentToYuanPipe = new CentToYuanPipe();
  @Output()
  private formSubmit = new EventEmitter<DistributeListItem>();
  private model: DistributeListItem = new DistributeListItem();
  @ViewChildren(FormControlErrorDirective)
  private controls: QueryList<FormControlErrorDirective>;
  @ViewChild('priceControl')
  private priceControl: FormControlErrorDirective
  private price: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private moutingsService: MountingsService,
  ) {
    Object.assign(this.model, this.newCreateUser);
  }

  ngOnInit() {
    this.buildForm();
  }
  newCreateUser = {
    createUser: "",
    createUserName: ""
  };
  ngOnChanges(changes: SimpleChanges) {
    if (this.form && changes['InputData']) {
      this.form.patchValue(this.InputData);
      this.newCreateUser.createUser = this.InputData.initCreatId;
      this.newCreateUser.createUserName = this.InputData.initCreatName;
      Object.assign(this.model, this.InputData);
      Object.assign(this.model, this.newCreateUser);
    }
  }

  @Input() InputData;

  valueObj: any;
  maintenanceItemId2: any;

  onSellerSelect(evt) {
    this.valueObj = evt.split(",,");
    console.log(this.valueObj);
    this.newCreateUser.createUser = this.valueObj[0];
    this.newCreateUser.createUserName = this.valueObj[1];
    Object.assign(this.model, this.newCreateUser);
    console.log(this.model)
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      brand: [this.model.brand, [Validators.required]],
      productCode: [this.model.productCode],
      productName: [this.model.productName],
      productId: [this.model.productId, [Validators.required, Validators.maxLength(36)]],
      productSpecification: [this.model.productSpecification, [Validators.required]],
      storeId: [this.model.storeId],
      locationId: [this.model.locationId],
      count: [this.model.count, [Validators.required, CustomValidators.digits]],
      price: [this.model.price, [CustomValidators.gte(this.price)]],
      amount: [this.model.amount],
      stockCount: [this.model.stockCount, [Validators.required]],
      locationName: [this.model.locationName, [Validators.required]],
      houseName: [this.model.houseName, [Validators.required]],
      vihicleName: [this.model.vihicleName],
      createUser: [this.model.createUser],
      description: [this.model.description],
      serviceName: this.model.serviceName,
      maintenanceItemId: this.model.maintenanceItemId
    })
  }

  public onSubmit(event: Event) {
    console.log(this.model);
    console.log(this.form.value)
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
  }

  public onReset() {
    this.form = null;
    setTimeout(() => this.buildForm(), 1);
    return false;
  }

  public itemColumns(isName: boolean) {
    return [
      { name: 'name', title: '名称', weight: isName ? 1 : 0 },
      { name: 'code', title: '编码', weight: isName ? 0 : 1 },
      { name: 'brand', title: '品牌' },
      { name: 'houseName', title: '仓库' },
      { name: 'locationName', title: '库位' },
    ];
  }

  public onPriceChange(evt) {
    //evt.preventDefault();
    let price = evt.target.value || 0;
    this.model.price = price * 100;
    this.model.amount = (this.model.price) * (this.model.count);
    this.form.patchValue(this.model);
    this.priceControl.validate();
  }
  public onChangeCount(evt) {
    evt.preventDefault();
    this.model.count = evt.target.value;
    this.model.amount = (this.model.count) * (this.model.price);
    console.log(this.model.amount)
  }

  public onItemSelect(event) {
    console.log(event);
    let item = {
      productCode: event.code,
      productName: event.name,
      productSpecification: event.specification,
      productId: event.productId,
      brand: event.brand,
      brandId: event.brandId,
      storeId: event.storeId,
      houseName: event.houseName,
      locationId: event.locationId,
      locationName: event.locationName,
      stockCount: event.count,
      price: event.costPrice,
    }
    this.price = 0;
    setTimeout(() => this.price = item.price, 1);
    Object.assign(this.model, item);
    console.log(this.model)
    this.form.patchValue(item);
    this.form.controls['price'].setValidators(CustomValidators.gte(item.price));
    this.calculate();
  }

  public get codeSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new GetMountingsListRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.moutingsService.getListByCodeOrName(p);
    };
  }

  public get nameSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new GetMountingsListRequest(undefined, params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.moutingsService.getListByCodeOrName(p);
    };
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
