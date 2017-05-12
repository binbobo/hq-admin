import { Component, OnInit, Injector, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CentToYuanPipe } from "app/shared/pipes";
import { FormControlErrorDirective, TypeaheadRequestParams } from "app/shared/directives";
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
  private model: InnerListItem = new InnerListItem();
  @ViewChildren(FormControlErrorDirective)
  private controls: QueryList<FormControlErrorDirective>;

  constructor(
    private formBuilder: FormBuilder,
    private moutingsService: MountingsService,
  ) { }
  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      brand: [this.model.brand, [Validators.required]],
      productCode: [this.model.productCode],
      productName: [this.model.productName],
      productCategory: [this.model.productCategory],
      productId: [this.model.productId, [Validators.required, Validators.maxLength(36)]],
      productSpecification: [this.model.productSpecification, [Validators.required]],
      storeId: [this.model.storeId],
      locationId: [this.model.locationId],
      count: [this.model.count, [Validators.required, CustomValidators.digits]],
      price: [this.model.price],
      amount: [this.model.amount],
      description: [this.model.description],
      locationName: [this.model.locationName, [Validators.required]],
      houseName: [this.model.houseName, [Validators.required]],
      yuan: [0, [Validators.required]],
    })
  }

  public onSubmit(event: Event) {
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
  //定义模糊查询要显示的列
  public itemColumns(isName: boolean) {
    return [
      { name: 'name', title: '名称', weight: isName ? 1 : 0 },
      { name: 'code', title: '编码', weight: isName ? 0 : 1 },
      { name: 'brand', title: '品牌' },
      { name: 'houseName', title: '仓库' },
      { name: 'locationName', title: '库位' },
    ];
  }
  //编码数据源
  public get codeSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new GetMountingsListRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.moutingsService.getListByCodeOrName(p);
    };
  }
  //名称数据源
  public get nameSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new GetMountingsListRequest(undefined, params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.moutingsService.getListByCodeOrName(p);
    };
  }
  //单价变动限制
  onPriceChange(event) {
    let val = event.target.value || 0;
    let price = Math.floor(val * 100);
    this.form.patchValue({ price: price });
    this.calculate();
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
      productCategory: event.Category,
      price: event.price,
      yuan: (event.price || 0) / 100,
    }
    this.form.controls['yuan'].setValidators(CustomValidators.gte(item.price / 100))
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
