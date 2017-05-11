import { Component, OnInit, EventEmitter, Output, ViewChildren, QueryList } from '@angular/core';
import { TypeaheadRequestParams, FormControlErrorDirective } from 'app/shared/directives';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { CentToYuanPipe } from 'app/shared/pipes';
import { ProcurementService, ProcurementItem, GetProductsRequest } from '../procurement.service';

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
  private model: ProcurementItem = new ProcurementItem();
  @ViewChildren(FormControlErrorDirective)
  private controls: QueryList<FormControlErrorDirective>;

  constructor(
    private formBuilder: FormBuilder,
    private procurementService: ProcurementService,
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      brand: [this.model.brand],
      productCode: [this.model.productCode],
      productName: [this.model.productName],
      productCategory: [this.model.productCategory],
      packingCode: [this.model.packingCode],
      taxRate: [this.model.taxRate],
      productId: [this.model.productId, [Validators.required, Validators.maxLength(36)]],
      productSpecification: [this.model.productSpecification],
      storeId: [this.model.storeId],
      locationId: [this.model.locationId],
      count: [this.model.count, [Validators.required, CustomValidators.digits]],
      price: [this.model.price],
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

  public itemColumns(isName: boolean) {
    return [
      { name: 'brand', title: '品牌' },
      { name: 'productName', title: '名称', weight: isName ? 1 : 0 },
      { name: 'productCode', title: '编码', weight: isName ? 0 : 1 },
      { name: 'specification', title: '规格' },
      { name: 'vehicleName', title: '车型' },
    ];
  }

  public onItemSelect(event) {
    let item = {
      productCode: event.productCode,
      productName: event.productName,
      packingCode: event.packingCode,
      productSpecification: event.specification,
      productId: event.productId,
      brand: event.brand,
      brandId: event.brandId,
      storeId: event.storeId,
      storeName: event.storeName,
      locationId: event.locationId,
      locationName: event.locationName,
      stockCount: event.count,
      price: event.price,
      taxRate: event.taxRate,
      exTaxPrice: event.exTaxPrice,
      productCategory: event.productCategory,
    }
    this.form.patchValue(item);
    this.calculate();
  }

  public get codeSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new GetProductsRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.procurementService.getProducts(p);
    };
  }

  public get nameSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new GetProductsRequest(undefined, params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.procurementService.getProducts(p);
    };
  }

  private calculate() {
    let count = this.form.controls['count'].value || 0;
    let price = this.form.controls['price'].value || 0;
    let exTaxPrice = this.form.controls['exTaxPrice'].value || 0;
    let amount = count * price;
    let exTaxAmount = count * exTaxPrice;
    this.form.patchValue({
      amount: amount,
      count: count,
      price: price,
      exTaxAmount: exTaxAmount,
      exTaxPrice: exTaxPrice
    });
  }
}