import { Component, OnInit, Output, ViewChildren, EventEmitter, QueryList, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CentToYuanPipe } from "app/shared/pipes";
import { TypeaheadRequestParams, FormGroupControlErrorDirective, HqAlerter } from "app/shared/directives";
import { CustomValidators } from "ng2-validation/dist";
import { SalesReturnListItem } from "../sales-return.service";

@Component({
  selector: 'hq-sales-return-create',
  templateUrl: './sales-return-create.component.html',
  styleUrls: ['./sales-return-create.component.css']
})
export class SalesReturnCreateComponent implements OnInit {

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

  private originalId: any;//每一条数据ID
  private locationId: any;//库位ID
  private productId: any;//配件ID
  private stockCounts: any;//库存
  private canReturnCount: any;//可退数量

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (this.selectSalesData) {
      this.originalId = this.selectSalesData.id;
      this.locationId = this.selectSalesData.locationId;
      this.productId = this.selectSalesData.productId;
      this.canReturnCount = this.selectSalesData.count - this.selectSalesData.returnCount;
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
    if (count > this.canReturnCount) {
      this.alerter.error("数量不能高于当前可退数量，请重新填写", true, 2000);
      return false;
    }
    if (count <= 0) {
      this.alerter.error("数量必须大于0，请重新填写", true, 2000);
      return false;
    }
    this.form.value['originalId'] = this.originalId;
    this.form.value['locationId'] = this.locationId;
    this.form.value['productId'] = this.productId;
    this.form.value['stockCounts'] = this.stockCounts + count;
    this.form.value['productUnit'] = this.form.value.unit;
    this.form.value.count = count;
    this.formSubmit.emit(this.form.value);
  }

  // public onReset() {
  //   this.form = null;
  //   setTimeout(() => this.buildForm(), 1);
  //   return false;
  // }


  private calculate() {
    let count = this.form.controls['counts'].value;
    if (count > this.canReturnCount) {
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
