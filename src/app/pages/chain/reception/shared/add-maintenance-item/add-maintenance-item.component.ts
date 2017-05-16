import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TypeaheadRequestParams, HqAlerter } from 'app/shared/directives';
import { OrderService } from '../../../reception/order.service';
import { FuzzySearchRequest } from '../../../report/maintenance/business/business.service';
import * as moment from 'moment';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'hq-add-maintenance-item',
  templateUrl: './add-maintenance-item.component.html',
  styleUrls: ['./add-maintenance-item.component.css']
})

export class AddMaintenanceItemComponent implements OnInit {
  maintenanceItemForm: FormGroup;

  @Output() onCancel = new EventEmitter<any>();
  @Output() onConfirm = new EventEmitter<any>();

  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;

  constructor(
    private fb: FormBuilder,
    protected service: OrderService,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  serviceTypeaheadOnSelect(evt) {
    this.maintenanceItemForm.controls.serviceId.setValue(evt.id);
    this.maintenanceItemForm.controls.serviceName.setValue(evt.name);
  }

  onCancelHandler() {
    this.onCancel.emit();
    this.maintenanceItemForm.reset();
  }
  onConfirmHandler() {
    if (!this.maintenanceItemForm.value.serviceId) {
      // 添加维修项目
      this.service.createMaintenanceItem({ name: this.maintenanceItemForm.value.serviceName })
        .then(data => {
          this.alerter.success('新建维修项目成功, 返回的数据为：', data);
          this.maintenanceItemForm.value.serviceId = data.id;

          // 验证数据合法性
          this.onConfirm.emit(this.maintenanceItemForm.value);
          this.maintenanceItemForm.reset({
            operationTime: { value: moment().format('YYYY-MM-DD hh:mm:ss'), disabled: true },
            discount: 100
          }, { emitEvent: false });
        }).catch(err => {
          this.alerter.error('新建维修项目失败：' + err + '请重新输入维修项目名称');
        });
    } else {
      // 验证数据合法性
      this.onConfirm.emit(this.maintenanceItemForm.getRawValue());
      this.maintenanceItemForm.reset({
        operationTime: { value: moment().format('YYYY-MM-DD hh:mm:ss'), disabled: true },
        discount: 100
      }, { emitEvent: false });
    }

  }

  createForm() {
    this.maintenanceItemForm = this.fb.group({
      serviceName: ['', [Validators.required]],
      serviceId: [''],
      workHour: ['', [Validators.required, CustomValidators.number, CustomValidators.gt(0)]],
      price: ['', [Validators.required, CustomValidators.number, CustomValidators.gt(0)]],
      discount: [100, [Validators.required, CustomValidators.digits, CustomValidators.range([0, 100])]],
      amount: [{ value: '', disabled: true }],
      operationTime: [{ value: moment().format('YYYY-MM-DD hh:mm:ss'), disabled: true }],
    });
    this.maintenanceItemForm.controls.amount.valueChanges.subscribe(newValue => {
      this.maintenanceItemForm.controls.amount.patchValue(newValue / 100, { emitEvent: false });
    });
  }
  // 定义维修项目模糊查询要显示的列
  public get nameTypeaheadColumns() {
    return [
      { name: 'name', title: '名称' },
    ];
  }

  // 根据维修项目名称模糊查询数据源
  public get serviceNameTypeaheadSource() {
    return (params: TypeaheadRequestParams) => {
      const p = new FuzzySearchRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.service.getMaintenanceItemsByName(p).then(pagedData => {
        return pagedData;
      });
    };
  }
}


