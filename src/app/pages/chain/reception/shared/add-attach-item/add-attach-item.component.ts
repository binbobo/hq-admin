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
  private model = {
    description: "",
    serviceName: "",
    type: 2
  };
  @Output() onCancel = new EventEmitter<any>();
  @ViewChildren(FormControlErrorDirective)
  private controls: QueryList<FormControlErrorDirective>;
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
    console.log(this.item)
    if (this.item) {
      this.form.patchValue(this.item);
      Object.assign(this.model, this.item);
    }
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      description: [this.model.description, [Validators.required]],
      serviceName: [this.model.serviceName]

    })
  }
  onCancelHandler() {
    this.onCancel.emit();
  }

  public onSubmit(event: Event) {
    this.model.serviceName = this.model.description;
    Object.assign(this.form.value, this.model);

    if (!this.model.description) {
      this.alerter.error("项目内容不能为空", true, 3000);
      return false;
    } else {
      this.formSubmit.emit(this.form.value);
      this.form.reset(this.model);
      this.onCancel.emit();
    }
  }





}
