import { Component, OnInit, Injector, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { SalesListItem } from '../sales.service';
import { Observable } from "rxjs/Rx";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormControlErrorDirective } from 'app/shared/directives';

@Component({
  selector: 'hq-sales-create',
  templateUrl: './sales-create.component.html',
  styleUrls: ['./sales-create.component.css']
})
export class SalesCreateComponent implements OnInit {

  private form: FormGroup;
  @Output()
  private formSubmit = new EventEmitter<SalesListItem>();
  private model: SalesListItem = new SalesListItem();
  @ViewChildren(FormControlErrorDirective)
  private controls: QueryList<FormControlErrorDirective>;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      brand: [this.model.brand, [Validators.required]],
      productCode: [this.model.productCode, [Validators.required]],
      productName: [this.model.productName, [Validators.required, Validators.maxLength(50)]],
      productId: [this.model.productId, []],//[Validators.required, Validators.maxLength(36)]],
      productSpecification: [this.model.productSpecification, [Validators.required]],
      storeId: [this.model.storeId, [Validators.required, Validators.maxLength(36)]],
      locationId: [this.model.locationId, [Validators.required, Validators.maxLength(36)]],
      count: [this.model.count, [Validators.required]],
      price: [this.model.price, [Validators.required]],
      amount: [this.model.amount, [Validators.required]],
      stockCount: [this.model.stockCount, [Validators.required]],
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

}
