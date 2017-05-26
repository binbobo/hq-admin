import { Component, OnInit, Injector, Output, EventEmitter, ViewChildren, QueryList, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CentToYuanPipe } from "app/shared/pipes";
import { FormGroupControlErrorDirective, TypeaheadRequestParams, HqAlerter } from "app/shared/directives";
import { MountingsService, GetMountingsListRequest } from "../../../mountings.service";
import { CustomValidators } from "ng2-validation/dist";
import { InnerListItem, InnerReturnService } from "../inner-return.service";
import { FormHandle } from 'app/shared/models';
import { Observable } from "rxjs/Rx";
@Component({
  selector: 'hq-return-create',
  templateUrl: './return-create.component.html',
  styleUrls: ['./return-create.component.css']
})
export class ReturnCreateComponent implements OnInit {

  private form: FormGroup;
  private converter: CentToYuanPipe = new CentToYuanPipe();
  @Output()
  private formSubmit = new EventEmitter<InnerListItem>();
  private model: InnerListItem;
  @ViewChildren(FormGroupControlErrorDirective)
  private controls: QueryList<FormGroupControlErrorDirective>;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;

  private originalId: any;//每一条数据ID
  private locationId: any;//库位ID
  private productId: any;//库位ID
  private existCounts: any;//库存
  private canReturnCount: any;//可退数量

  @Input()
  selectReturnData: any;

  constructor(
    private formBuilder: FormBuilder,
    private moutingsService: MountingsService,
  ) { }

  ngOnInit() {
    this.buildForm();
    if (this.selectReturnData) {
      this.originalId = this.selectReturnData.id;
      this.locationId = this.selectReturnData.locationId;
      this.productId = this.selectReturnData.productId;
      this.canReturnCount = this.selectReturnData.count - this.selectReturnData.returnCount;
      this.existCounts = this.selectReturnData.existCount;
      this.selectReturnData.amount = (this.selectReturnData.price * 1).toFixed(2);
      this.selectReturnData.productCategory = this.selectReturnData.productTypes[0];
      this.selectReturnData.productSpecification = this.selectReturnData.specification;
      this.form.patchValue(this.selectReturnData);
    }

  }

  private buildForm() {
    this.form = this.formBuilder.group({
      brandName: [''],
      productCode: [''],
      productCategory: [''],
      productName: [''],
      productSpecification: [''],
      count: [''],
      price: [''],
      counts: [''],
      amount: [''],
      unit: [''],
      locationName: [''],
      storeName: [''],
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
    this.form.value['existCounts'] = this.existCounts + count;
    this.form.value['productUnit'] = this.form.value.unit;
    this.form.value.count = count;
    this.formSubmit.emit(this.form.value);
  }

  // public onReset() {
  //   this.form = null;
  //   setTimeout(() => this.buildForm(), 1);
  //   return false;
  // }


  //数量改变控制
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
    // count = Math.floor(count || 0);
    // price = Math.floor(price || 0);
    let amount = ((count || 0) * (price || 0)).toFixed(2);
    this.form.patchValue({ amount: amount, count: count, price: price });
  }

}
