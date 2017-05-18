import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TypeaheadRequestParams, HqAlerter } from 'app/shared/directives';
import { OrderService } from '../../../reception/order.service';
import { FuzzySearchRequest } from '../../../report/maintenance/business/business.service';
import * as moment from 'moment';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'hq-add-attach-item',
  templateUrl: './add-attach-item.component.html',
  styleUrls: ['./add-attach-item.component.css']
})
export class AddAttachItemComponent implements OnInit {

  attachItemForm: FormGroup;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onConfirm = new EventEmitter<any>();

  @Input()
  item: any = null; // 当前编辑的维修项目
  @Input()
  serviceIds: any = []; // 当前已经选择的维修项目id列表

  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;

  constructor(
    private fb: FormBuilder,
    protected service: OrderService,
  ) { }

  ngOnInit() {
    this.createForm();

    console.log('当前已经选择的维修项目id列表为：', this.serviceIds);
    // 编辑
    if (this.item) {
      this.attachItemForm.patchValue(this.item);
    }
  }

  serviceTypeaheadOnSelect(evt) {
    this.attachItemForm.controls.serviceId.setValue(evt.description);
  }

  onCancelHandler() {
    this.onCancel.emit();
  }
  onConfirmHandler() {
    if (!this.attachItemForm.value.serviceId) {
      // 添加维修项目
      this.service.createMaintenanceItem({ name: this.attachItemForm.value.serviceName })
        .then(data => {
          this.alerter.success('新建维修项目成功, 返回的数据为：', data);
          this.attachItemForm.value.serviceId = data.id;

          // 验证数据合法性
          this.onConfirm.emit({
            data: this.attachItemForm.getRawValue(), // 维修项目数据
            isEdit: this.item ? true : false  // 是否为编辑标志
          });
        }).catch(err => {
          this.alerter.error('新建维修项目失败：' + err + '请重新输入维修项目名称');
        });
    } else {
      // 验证数据合法性
      this.onConfirm.emit({
        data: this.attachItemForm.getRawValue(),
        isEdit: this.item ? true : false
      });
    }

  }

  createForm() {
    this.attachItemForm = this.fb.group({
      description: ['', [Validators.required]],
    });

  }


  }
