import { Component, OnInit, Output, ViewChildren, EventEmitter, QueryList, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CentToYuanPipe } from "app/shared/pipes";
// import { SalesReturnListItem } from "../sales-return.service";
import { TypeaheadRequestParams, FormGroupControlErrorDirective, HqAlerter } from "app/shared/directives";
import { MountingsService, GetMountingsListRequest } from "app/pages/chain/mountings/mountings.service";
import { CustomValidators } from "ng2-validation/dist";
import { SalesReturnListItem } from "../sales-return.service";

@Component({
  selector: 'hq-sales-return-create',
  templateUrl: './sales-return-create.component.html',
  styleUrls: ['./sales-return-create.component.css']
})
export class SalesReturnCreateComponent implements OnInit {

  // private salesReturnData = [];
  @Input()
  selectSalesData: any;

  private form: FormGroup;
  private converter: CentToYuanPipe = new CentToYuanPipe();
  @Output()
  private formSubmit = new EventEmitter<SalesReturnListItem>();
  private model: SalesReturnListItem = new SalesReturnListItem();
  @ViewChildren(FormGroupControlErrorDirective)
  private controls: QueryList<FormGroupControlErrorDirective>;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;

  private originalBillId: any;//每一条数据ID
  private locationId: any;//库位ID
  private productId: any;//配件ID
  private stockCounts: any;//库存

  constructor(
    private formBuilder: FormBuilder,
    private moutingsService: MountingsService,
  ) { }

  ngOnInit() {
    this.buildForm();
    console.log('弹框页面显示数据', this.selectSalesData);
    
    if (this.selectSalesData) {
      this.originalBillId = this.selectSalesData.id;
      this.locationId = this.selectSalesData.locationId;
      this.productId = this.selectSalesData.productId;
      this.stockCounts = this.selectSalesData.stockCount;
      this.selectSalesData.amount = (this.selectSalesData.price * 1).toFixed(2);
      this.selectSalesData.productCategory = this.selectSalesData.categoryName[0];
      this.selectSalesData.productSpecification = this.selectSalesData.specification;
      this.form.patchValue(this.selectSalesData);
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      brandName: [''],
      productCode: [''],
      productName: [''],
      productCategory: [''],
      productSpecification: [''],
      locationId: [''],
      count: [''],
      price: [''],
      amount: [''],
      unit: [''],
      locationName: [''],
      storeName: [''],
      counts: [''],
    })
  }

  public onSubmit() {
    let count = this.form.controls['counts'].value;
    if (count > (this.selectSalesData.count - this.selectSalesData.returnCount)) {
      this.alerter.error("数量不能高于当前可退数量，请重新填写", true, 2000);
      return false;
    }
    if (count <= 0) {
      this.alerter.error("数量必须大于0，请重新填写", true, 2000);
      return false;
    }
    this.form.value['originalId'] = this.originalBillId;
    this.form.value['locationId'] = this.locationId;
    this.form.value['productId'] = this.productId;
    this.form.value['stockCounts'] = this.stockCounts + count;
    this.form.value.count = count;
    console.log('表单数据', this.form.value);
    this.formSubmit.emit(this.form.value);
    // let invalid = this.controls
    //   .map(c => c.validate())
    //   .some(m => !m);
    // if (invalid) {
    //   event.preventDefault();
    //   return false;
    // } else {
    //   // this.formSubmit.emit(this.form.value);
    //   // this.form.reset(this.model);
    // }
  }

  // public onReset() {
  //   this.form = null;
  //   setTimeout(() => this.buildForm(), 1);
  //   return false;
  // }

  // onPriceChange(event) {
  //   let val = event.target.value || 0;
  //   let price = Math.floor(val * 100);
  //   this.form.patchValue({ price: price });
  //   this.calculate();
  // }

  // public itemColumns(isName: boolean) {
  //   return [
  //     { name: 'name', title: '名称', weight: isName ? 1 : 0 },
  //     { name: 'code', title: '编码', weight: isName ? 0 : 1 },
  //     { name: 'brand', title: '品牌' },
  //     { name: 'houseName', title: '仓库' },
  //     { name: 'locationName', title: '库位' },
  //   ];
  // }

  // public onItemSelect(event) {
  //   let item = {
  //     productCode: event.code,
  //     productName: event.name,
  //     productSpecification: event.specification,
  //     productId: event.productId,
  //     brand: event.brand,
  //     brandId: event.brandId,
  //     storeId: event.storeId,
  //     houseName: event.houseName,
  //     locationId: event.locationId,
  //     locationName: event.locationName,
  //     price: event.price,
  //     yuan: (event.price || 0) / 100,
  //   }
  //   this.form.controls['yuan'].setValidators(CustomValidators.gte(item.price / 100))
  //   setTimeout(() => {
  //     this.form.patchValue(item);
  //     this.calculate();
  //   }, 1);
  // }

  // public get codeSource() {
  //   return (params: TypeaheadRequestParams) => {
  //     let p = new GetMountingsListRequest(params.text);
  //     p.setPage(params.pageIndex, params.pageSize);
  //     return this.moutingsService.getListByCodeOrName(p);
  //   };
  // }

  // public get nameSource() {
  //   return (params: TypeaheadRequestParams) => {
  //     let p = new GetMountingsListRequest(undefined, params.text);
  //     p.setPage(params.pageIndex, params.pageSize);
  //     return this.moutingsService.getListByCodeOrName(p);
  //   };
  // }

  private calculate() {
    let count = this.form.controls['counts'].value;
    if (count > (this.selectSalesData.count - this.selectSalesData.returnCount)) {
      this.alerter.error("数量不能高于当前可退数量，请重新填写", true, 2000);
      return false;
    }
    if (count <= 0) {
      this.alerter.error("数量必须大于0，请重新填写", true, 2000);
      return false;
    }
    let price = this.form.controls['price'].value;
    let amount = ((count || 0) * (price || 0)).toFixed(2);
    this.form.patchValue({ amount: amount, count: count, price: price });
  }

}
