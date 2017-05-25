import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HqAlerter } from 'app/shared/directives';
import { OrderService } from '../../../reception/order.service';
import * as moment from 'moment';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'hq-add-suggest-item',
  templateUrl: './add-suggest-item.component.html',
  styleUrls: ['./add-suggest-item.component.css']
})
export class AddSuggestItemComponent implements OnInit {

  suggestItemForm: FormGroup;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onConfirm = new EventEmitter<any>();

  @Input()
  item: any = null; // 当前编辑的维修项目
  @Input()
  services: any = []; // 当前已经选择的维修项目列表
  serviceIds: any = [];

  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;

  constructor(
    private fb: FormBuilder,
    protected service: OrderService,
  ) { }

  ngOnInit() {
    this.createForm();
    console.log('当前已经选择的维修项目列表为：', this.services);
    this.serviceIds = this.services.map(item => item.id);
    // 编辑
    if (this.item) {
      this.suggestItemForm.patchValue(this.item);
    }
  }

  serviceTypeaheadOnSelect(evt) {
    this.suggestItemForm.controls.serviceId.setValue(evt.id);
    this.suggestItemForm.controls.serviceName.setValue(evt.name);
  }

  onCancelHandler() {
    this.onCancel.emit();
  }
  onConfirmHandler() {
    // 验证数据合法性
    this.onConfirm.emit({
      data: this.suggestItemForm.getRawValue(),
      isEdit: this.item ? true : false
    });

  }

  createForm() {
    this.suggestItemForm = this.fb.group({
      serviceName: ['', [Validators.required]],
      serviceId: [''],
      description: [''],
      operationTime: [{ value: moment().format('YYYY-MM-DD HH:mm:ss'), disabled: true }],
    });

  }
}
