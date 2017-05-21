import { Component, OnInit, Output, ViewChildren, EventEmitter, QueryList } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CentToYuanPipe } from "app/shared/pipes";
import { SalesReturnListItem } from "../sales-return.service";
import { TypeaheadRequestParams, FormGroupControlErrorDirective } from "app/shared/directives";
import { MountingsService, GetMountingsListRequest } from "app/pages/chain/mountings/mountings.service";
import { CustomValidators } from "ng2-validation/dist";

@Component({
  selector: 'hq-sales-return-create',
  templateUrl: './sales-return-create.component.html',
  styleUrls: ['./sales-return-create.component.css']
})
export class SalesReturnCreateComponent implements OnInit {

  private form: FormGroup;
  private converter: CentToYuanPipe = new CentToYuanPipe();
  @Output()
  private formSubmit = new EventEmitter<SalesReturnListItem>();
  private model: SalesReturnListItem = new SalesReturnListItem();
  @ViewChildren(FormGroupControlErrorDirective)
  private controls: QueryList<FormGroupControlErrorDirective>;

  constructor(
    private formBuilder: FormBuilder,
    private moutingsService: MountingsService,
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      brandName: ['', [Validators.required]],
      productCode: [''],
      productName: [''],
      productId: ['', [Validators.required, Validators.maxLength(36)]],
      specification: ['', [Validators.required]],
      storeId: [''],
      locationId: [''],
      count: ['', [Validators.required, CustomValidators.digits]],
      price: [''],
      amount: [''],
      locationName: ['', [Validators.required]],
      storeName: ['', [Validators.required]],
      counts: [1, [Validators.required]],
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

  onPriceChange(event) {
    let val = event.target.value || 0;
    let price = Math.floor(val * 100);
    this.form.patchValue({ price: price });
    this.calculate();
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
      price: event.price,
      yuan: (event.price || 0) / 100,
    }
    this.form.controls['yuan'].setValidators(CustomValidators.gte(item.price / 100))
    setTimeout(() => {
      this.form.patchValue(item);
      this.calculate();
    }, 1);
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
