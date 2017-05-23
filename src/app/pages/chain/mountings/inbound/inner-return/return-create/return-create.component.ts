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

  private originalBillId: any;//每一条数据ID
  private locationId: any;//库位ID
  private productId: any;//库位ID
  private existCounts: any;//库存

  @Input()
  selectReturnData: any;

  constructor(
    private formBuilder: FormBuilder,
    private moutingsService: MountingsService,
  ) { }

  ngOnInit() {
    this.buildForm();
    console.log('传过来的数据', this.selectReturnData);
    if (this.selectReturnData) {
      this.originalBillId = this.selectReturnData.id;
      this.locationId = this.selectReturnData.locationId;
      this.productId = this.selectReturnData.productId;
      this.existCounts = this.selectReturnData.existCount;
      this.selectReturnData.amount = (this.selectReturnData.price * 1).toFixed(2);
      this.selectReturnData.productTypes = this.selectReturnData.productTypes[0];
      this.form.patchValue(this.selectReturnData);
    }

  }

  private buildForm() {
    this.form = this.formBuilder.group({
      brandName: ['', [Validators.required]],
      productCode: [''],
      productTypes: [''],
      productName: [''],
      specification: ['', [Validators.required]],
      count: ['', [Validators.required, CustomValidators.digits]],
      price: [''],
      counts: [''],
      amount: [''],
      unit: [''],
      locationName: ['', [Validators.required]],
      storeName: ['', [Validators.required]],
    })
  }

  public onSubmit() {
    let count = this.form.controls['counts'].value;
    if (count > (this.selectReturnData.count - this.selectReturnData.returnCount)) {
      this.alerter.error("数量不能高于当前可退数量，请重新填写", true, 2000);
      return false;
    }
    if (count <= 0) {
      this.alerter.error("数量必须大于0，请重新填写", true, 2000);
      return false;
    }
    // let invalid = this.controls
    //   .map(c => c.validate())
    //   .some(m => !m);
    // if (invalid) {
    //   event.preventDefault();
    //   return false;
    // } else {
    this.form.value['originalId'] = this.originalBillId;
    this.form.value['locationId'] = this.locationId;
    this.form.value['productId'] = this.productId;
    this.form.value['existCounts'] = this.existCounts + count;
    this.form.value.count = count;
    console.log('表单数据', this.form.value);
    this.formSubmit.emit(this.form.value);
    // this.form.reset(this.model);
    // }
  }

  // public onReset() {
  //   this.form = null;
  //   setTimeout(() => this.buildForm(), 1);
  //   return false;
  // }
  //定义模糊查询要显示的列
  // public itemColumns(isName: boolean) {
  //   return [
  //     { name: 'name', title: '名称', weight: isName ? 1 : 0 },
  //     { name: 'code', title: '编码', weight: isName ? 0 : 1 },
  //     { name: 'brand', title: '品牌' },
  //     { name: 'houseName', title: '仓库' },
  //     { name: 'locationName', title: '库位' },
  //   ];
  // }
  //编码数据
  // public get codeSource() {
  //   return (params: TypeaheadRequestParams) => {
  //     let p = new GetMountingsListRequest(params.text);
  //     p.setPage(params.pageIndex, params.pageSize);
  //     return this.moutingsService.getListByCodeOrName(p);
  //   };
  // }
  //名称数据
  // public get nameSource() {
  //   return (params: TypeaheadRequestParams) => {
  //     let p = new GetMountingsListRequest(undefined, params.text);
  //     p.setPage(params.pageIndex, params.pageSize);
  //     return this.moutingsService.getListByCodeOrName(p);
  //   };
  // }
  //单价变动限制
  // onPriceChange(event) {
  //   let val = event.target.value || 0;
  //   let price = Math.floor(val * 100);
  //   this.form.patchValue({ price: price });
  //   this.calculate();
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
  //     productCategory: event.Category,
  //     price: event.price,
  //     yuan: (event.price || 0) / 100,
  //   }
  //   this.form.controls['yuan'].setValidators(CustomValidators.gte(item.price / 100))
  //   setTimeout(() => {
  //     this.form.patchValue(item);
  //     this.calculate();
  //   }, 1);
  // }

  //数量改变控制
  private calculate() {
    let count = this.form.controls['counts'].value;
    if (count > (this.selectReturnData.count - this.selectReturnData.returnCount)) {
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
