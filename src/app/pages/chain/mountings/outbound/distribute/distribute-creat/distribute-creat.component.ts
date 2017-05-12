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

  }

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.form && changes['InputData']) {
      this.form.patchValue(this.InputData);
      Object.assign(this.model, this.InputData);
    }
  }

  @Input() InputData;
  valueObj: any;


  onSellerSelect(evt) {
    console.log(evt)
    let creatAry = [];
    creatAry = this.InputData.employeesData.filter(item => item.id === evt.target.value);
    console.log(creatAry)
    this.model.createUserName = creatAry[0].name;
    this.model.createUser = creatAry[0].id;
    console.log(this.model,this.form.value)
    this.form.value["createUserName"]=this.model.createUserName;

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
      count: [this.model.count, [Validators.required, CustomValidators.lte(this.model.count), CustomValidators.digits]],
      price: [this.model.price, [Validators.required, CustomValidators.gte(this.price)]],
      amount: [this.model.amount],
      stockCount: [this.model.stockCount, [Validators.required]],
      locationName: [this.model.locationName, [Validators.required]],
      houseName: [this.model.houseName, [Validators.required]],
      vihicleName: [this.model.vihicleName],
      createUser: [this.model.createUser, [Validators.required]],
      createUserName: [this.model.createUserName],
      description: [this.model.description],
      serviceName: this.model.serviceName,
      maintenanceItemId: this.model.maintenanceItemId
    })
  }

  public onSubmit(event: Event) {
    Object.assign(this.form.value,this.model);
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
    this.form.reset();

  }

  public onReset() {
    this.form.reset();
    // setTimeout(() => this.buildForm(), 1);
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
      count: event.count,
    }
    this.price = 0;
    setTimeout(() => this.price = item.price, 1);
    Object.assign(this.model, item);
    console.log(this.model)
    this.form.patchValue(item);
    this.form.controls['price'].setValidators(CustomValidators.gte(item.price));
    this.calculate();
    Object.assign(this.form.value,this.model);
    console.log(this.model,this.form.value)
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
