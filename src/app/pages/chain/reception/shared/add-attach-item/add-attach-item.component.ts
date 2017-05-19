import { Component, OnInit, Injector, OnChanges, Output, EventEmitter, ViewChildren, QueryList, Input, SimpleChanges, ViewChild } from '@angular/core';
import { FormHandle } from 'app/shared/models';
import { Observable } from "rxjs/Rx";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormControlErrorDirective, TypeaheadRequestParams, HqAlerter } from 'app/shared/directives';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'hq-add-attach-item',
  templateUrl: './add-attach-item.component.html',
  styleUrls: ['./add-attach-item.component.css']
})
export class AddAttachItemComponent implements OnInit {
  private form: FormGroup;
  @Output()
  private formSubmit = new EventEmitter<any>();

  @Output() onCancel = new EventEmitter<any>();
  @Input()
  item: any = null; // 当前编辑的维修项目
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  constructor(
    private formBuilder: FormBuilder,
  ) {

  }

  ngOnInit() {
    this.buildForm();

    if (this.item) {
      this.form.patchValue(this.item)
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      description: ["", [Validators.required]]
    })
  }
  onCancelHandler() {
    this.onCancel.emit();
  }

  public onSubmit(event: Event) {
    console.log(this.form.value)
    if (!this.form.controls.description.value) {
      this.alerter.error("备注不能为空", true, 3000);
      return false;
    } else {
      this.formSubmit.emit(this.form.value);
      this.onCancel.emit();
    }
  }

}
