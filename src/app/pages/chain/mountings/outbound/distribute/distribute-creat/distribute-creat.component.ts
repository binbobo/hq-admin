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
export class DistributeCreatComponent implements OnInit, OnChanges {
  selectCount: any;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  private form: FormGroup;
  private converter: CentToYuanPipe = new CentToYuanPipe();
  @Output()
  private formSubmit = new EventEmitter<DistributeListItem>();
  private model: DistributeListItem = new DistributeListItem();
  @ViewChildren(FormGroupControlErrorDirective)
  private controls: QueryList<FormGroupControlErrorDirective>;
  @ViewChild('printer')
  public printer: PrintDirective;
  @ViewChild('priceControl')
  private priceControl: FormGroupControlErrorDirective
  private price: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private DistributeService: DistributeService,
  ) {

  }

  ngOnInit() {
    this.buildForm();
    this.form.patchValue(this.InputData);
    Object.assign(this.model, this.InputData);
    this.model.createUser = this.InputData.employeesData[0].id;
    this.model.createUserName = this.InputData.employeesData[0].name;
    this.form.controls.createUser.setValue(this.InputData.employeesData[0].id)
    console.log(this.model)
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
    console.log(this.model, this.form.value)
    this.form.value["createUserName"] = this.model.createUserName;
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      brand: [this.model.brand],
      productCode: [this.model.productCode, [Validators.required]],
      productName: [this.model.productName, [Validators.required]],
      productId: [this.model.productId],
      productSpecification: [this.model.productSpecification],
      specifications: [this.model.specifications],
      storeId: [this.model.storeId],
      locationId: [this.model.locationId],
      vehicleName: [this.model.vehicleName],
      vihicleName: [this.model.vihicleName],
      count: [this.model.count, [Validators.required, CustomValidators.digits]],
      initcount: [this.model.initcount, [Validators.required, CustomValidators.gt(0), CustomValidators.digits]],
      price: [this.model.price, [Validators.required]],
      costPrice:[this.model.costPrice],
      amount: [this.model.amount],
      locationName: [this.model.locationName],
      houseName: [this.model.houseName],
      storeName: [this.model.storeName],
      storeHouse: [this.model.storeHouse],
      createUser: [this.model.createUser, [Validators.required]],
      createUserName: [this.model.createUserName],
      serviceName: this.model.serviceName,
      maintenanceItemId: this.model.maintenanceItemId,
      description:[this.model.description]
    })
  }

  public onSubmit(event: Event) {
    this.model.count = this.model.initcount;
    // this.model.amount = this.model.amount * 100;
    // this.model.price = this.model.price * 100;
    this.model.vihicleName = this.model.vehicleName;
    this.model.storeName = this.model.houseName;
    this.model.specifications = this.model.specifications;
    this.model.storeHouse = this.model.storeHouse;
    Object.assign(this.form.value, this.model);
    if (this.model.count > this.fcount) {
      this.alerter.error("发料数量不能高于当前库存数量，请重新填写。")
    }
    if(this.model.price>this.model.costPrice){

    }
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
    // evt.preventDefault();
    let price = evt.target.value || 0;
    this.model.price = price;
    this.model.amount = (this.model.price) * (this.model.initcount);
    this.form.patchValue(this.model);
    // this.priceControl.validate();
  }
  public onChangeCount(evt) {
    evt.preventDefault();
    this.model.initcount = evt.target.value;
    this.model.amount = (this.model.initcount) * (this.model.price);
    this.form.patchValue(this.model);
  }
  private fcount;
  public onItemSelect(event) {
    console.log(event)
    let item = {
      productCode: event.code,
      productName: event.name,
      productSpecification: event.specification,
      productId: event.productId,
      brand: event.brand,
      brandId: event.brandId,
      storeId: event.storeId,
      vehicleName: event.vehicleName,
      houseName: event.houseName,
      locationId: event.locationId,
      locationName: event.locationName,
      stockCount: event.count,
      price: event.price,
      count: event.count,
      costPrice: event.costPrice,
      description:event.description
    }
    this.fcount = item.count;
    this.price = 0;
    setTimeout(() => this.price = item.price, 1);
    setTimeout(() => this.fcount = item.count, 1);
    Object.assign(this.model, item);
    console.log(this.model)
    this.form.patchValue(item);
    this.form.controls['price'].setValidators([CustomValidators.gte(item.costPrice / 100), CustomValidators.gte(0)]);
    this.form.controls['initcount'].setValidators([CustomValidators.lte(this.fcount), CustomValidators.gt(0)]);
    this.model.price = this.model.price / 100;
    this.model.amount = (this.model.initcount) * (this.model.price);
    Object.assign(this.form.value, this.model);
    this.form.patchValue(this.model);
  }

  // public get codeSource() {
  //   return (params: TypeaheadRequestParams) => {
  //     let p = new GetMountingsListRequest(params.text);
  //     p.setPage(params.pageIndex, params.pageSize);
  //     return this.DistributeService.getProductList(p);
  //   };
  // }

  // public get nameSource() {
  //   return (params: TypeaheadRequestParams) => {
  //     let p = new GetMountingsListRequest(undefined, params.text);
  //     p.setPage(params.pageIndex, params.pageSize);
  //     return this.DistributeService.getProductList(p);
  //   };
  // }


}
