import { Component, OnInit, EventEmitter, Output, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { TypeaheadRequestParams, FormGroupControlErrorDirective, HqAlerter } from 'app/shared/directives';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { CentToYuanPipe } from 'app/shared/pipes';
import { ProcurementService, ProcurementItem, GetProductsRequest } from '../procurement.service';
import { MountingsService } from '../../../mountings.service';
import { SelectOption } from 'app/shared/models';

@Component({
  selector: 'hq-procurement-create',
  templateUrl: './procurement-create.component.html',
  styleUrls: ['./procurement-create.component.css']
})
export class ProcurementCreateComponent implements OnInit {

  private form: FormGroup;
  private converter: CentToYuanPipe = new CentToYuanPipe();
  @Output()
  private formSubmit = new EventEmitter<ProcurementItem>();
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  private model: ProcurementItem = new ProcurementItem();
  @ViewChildren(FormGroupControlErrorDirective)
  private controls: QueryList<FormGroupControlErrorDirective>;
  private warehouses: Array<SelectOption>;
  private isHQProduct = false;

  constructor(
    private formBuilder: FormBuilder,
    private procurementService: ProcurementService,
    private moutingsService: MountingsService,
  ) { }

  ngOnInit() {
    this.buildForm();
    this.moutingsService.getWarehouseOptions()
      .then(options => this.warehouses = options)
      .then(options => options.length ? options[0].value : '')
      .then(id => {
        this.form.controls['storeId'].setValue(id);
        this.model.storeId = id;
      })
      .catch(err => this.alerter.error(err))
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      brand: [this.model.brand],
      productCode: [this.model.productCode],
      productName: [this.model.productName],
      productCategory: [this.model.productCategory],
      productId: [this.model.productId, [Validators.required, Validators.maxLength(36)]],
      productSpecification: [this.model.productSpecification],
      storeId: [this.model.storeId, [Validators.required, Validators.maxLength(36)]],
      locationId: [this.model.locationId],
      count: [this.model.count, [Validators.required, CustomValidators.min(1), CustomValidators.digits]],
      price: [this.model.price, [Validators.required, CustomValidators.min(0)]],
      yuan: [this.model.price / 100, [Validators.required, CustomValidators.min(0)]],
      amount: [this.model.amount],
      exTaxPrice: [this.model.exTaxPrice],
      exTaxAmount: [this.model.exTaxAmount],
      locationName: [this.model.locationName, [Validators.required]],
      storeName: [this.model.houseName, [Validators.required]],
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

  private itemColumns(isName: boolean) {
    return [
      { name: 'brand', title: '品牌' },
      { name: 'code', title: '编码', weight: isName ? 0 : 1 },
      { name: 'name', title: '名称', weight: isName ? 1 : 0 },
      { name: 'specification', title: '规格' },
      { name: 'vehicleName', title: '车型' },
    ];
  }

  private onItemSelect(event) {
    let item = {
      productCode: event.code,
      productName: event.name,
      productSpecification: event.specification,
      productId: event.productId,
      brand: event.brand,
      brandId: event.brandId,
      storeId: event.storeId,
      storeName: event.houseName,
      locationId: event.locationId,
      locationName: event.locationName,
      stockCount: event.count,
      price: event.price,
      yuan: event.price / 100,
      taxRate: event.taxRate,
      exTaxPrice: event.exTaxPrice,
      productCategory: event.category,
    }
    this.form.patchValue(item);
    this.isHQProduct = true;
    this.calculate();
    this.controls.forEach(m => m.validate());
  }

  get editable() {
    return this.form.controls['productId'].value ? true : undefined;
  }

  onPriceChange(event) {
    let val = event.target.value || 0;
    let price = Math.floor(val * 100);
    this.form.controls['price'].setValue(price);
    this.calculate();
  }

  public get codeSource() {
    return (params: TypeaheadRequestParams) => {
      if (this.isHQProduct) {
        let model = Object.assign({}, this.model, { productCode: params.text });
        this.form.reset(model);
        this.isHQProduct = false;
      }
      let p = new GetProductsRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.procurementService.getProducts(p);
    };
  }

  public get nameSource() {
    return (params: TypeaheadRequestParams) => {
      if (this.isHQProduct) {
        let model = Object.assign({}, this.model, { productName: params.text });
        this.form.reset(model);
        this.isHQProduct = false;
      }
      let p = new GetProductsRequest(undefined, params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.procurementService.getProducts(p);
    };
  }

  private calculate() {
    let count = this.form.controls['count'].value || 0;
    let price = this.form.controls['price'].value || 0;
    let tax = this.model.taxRate || 0;
    let exTaxPrice = price / (tax * 0.01 + 1);
    let amount = count * price;
    let exTaxAmount = count * exTaxPrice;
    console.log(exTaxPrice);
    this.form.patchValue({
      amount: amount,
      count: count,
      price: price,
      exTaxAmount: exTaxAmount,
      exTaxPrice: exTaxPrice
    });
  }
}