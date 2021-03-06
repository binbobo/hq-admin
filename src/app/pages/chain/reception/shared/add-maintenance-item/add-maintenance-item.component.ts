import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HqAlerter } from 'app/shared/directives';
import { OrderService } from '../../../reception/order.service';
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

  @Input()
  item: any = null; // 当前编辑的维修项目
  @Input()
  services: any = []; // 当前已经选择的维修项目列表

  serviceIds: any = []; // 维修项目id列表

  // 维修项目类型数据
  serviceTypeData: any = [];

  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;

  constructor(
    private fb: FormBuilder,
    protected service: OrderService,
  ) {
    // 获取维修类型数据
    this.service.getServiceTypes()
      .subscribe(data => this.serviceTypeData = data);
  }

  ngOnInit() {
    this.createForm();
    this.serviceIds = this.services.map(item => item.id);
    // 编辑
    if (this.item) {
      this.maintenanceItemForm.patchValue(this.item);
    }
  }

  serviceNameInput() {
    this.maintenanceItemForm.controls.serviceId.reset();
    this.maintenanceItemForm.controls.serviceType.enable();
    this.maintenanceItemForm.controls.serviceType.reset();
  }

  serviceTypeaheadOnSelect(evt) {
    this.maintenanceItemForm.controls.serviceId.setValue(evt.id);
    this.maintenanceItemForm.controls.serviceName.setValue(evt.name);
    this.maintenanceItemForm.controls.serviceType.setValue(evt.type);
    this.maintenanceItemForm.controls.serviceType.disable();
  }

  onCancelHandler() {
    this.onCancel.emit();
  }
  onConfirmHandler() {
    if (!this.maintenanceItemForm.value.serviceId) {
      const index = this.services.findIndex(item => item.name === this.maintenanceItemForm.value.serviceName);
      if (index > -1) {
        alert('当前输入的维修项目已经添加过了, 如需修改, 请去列表页面编辑');
      } else {
        // 新增维修项目
        this.service.createMaintenanceItem({ name: this.maintenanceItemForm.value.serviceName })
          .then(data => {
            if (!data || !data.id) {
              this.alerter.error('新增维修项目失败，返回的数据为空', true, 3000);
              return;
            }
            const maintenanceItemFormVal = this.maintenanceItemForm.getRawValue();
            maintenanceItemFormVal.serviceId = data.id;
            this.onConfirm.emit({
              data: maintenanceItemFormVal, // 维修项目数据
              isEdit: this.item ? true : false  // 是否为编辑标志
            });
          }).catch(err => {
            this.alerter.error(err, true, 3000);
          });
      }
    } else {
      this.onConfirm.emit({
        data: this.maintenanceItemForm.getRawValue(),
        isEdit: this.item ? true : false
      });
    }

  }


  createForm() {
    // 保留一位小数正则
    const workHourRegex = /^[1-9]+(\.\d{1})?$|^[0]{1}(\.[1-9]{1}){1}$/; // 正浮点数  保留一位小数 不能为0 只能有一个前导0(不可以000.3)
    const workHourPriceRegex = /^[0-9]{1,6}(\.\d{1})?$/; // 可以为0  /^[0]{1}(\.\d{1})?$|^[1-9]+(\.\d{1})?$/

    this.maintenanceItemForm = this.fb.group({
      serviceName: ['', [Validators.required]],
      serviceId: [''],
      serviceType: ['', [Validators.required]],// 维修项目类型
      type: 1, // 1表示维修项目/
      workHour: ['', Validators.compose([Validators.required, Validators.pattern(workHourPriceRegex)])],
      price: ['', Validators.compose([Validators.required, Validators.pattern(workHourPriceRegex)])],
      discount: [100, [Validators.required, CustomValidators.digits, CustomValidators.range([0, 100])]],
      amount: [{ value: '', disabled: true }],
    });

    this.maintenanceItemForm.controls.price.valueChanges.subscribe(newValue => {
      if (this.maintenanceItemForm.controls.price.valid) {
        this.calAmount();
      }
    });
    this.maintenanceItemForm.controls.workHour.valueChanges.subscribe(newValue => {
      if (this.maintenanceItemForm.controls.workHour.valid) {
        this.calAmount();
      }
    });
    this.maintenanceItemForm.controls.discount.valueChanges.subscribe(newValue => {
      if (this.maintenanceItemForm.controls.discount.valid) {
        this.calAmount();
      }
    });
  }
  // 计算金额
  calAmount() {
    const workHour = this.maintenanceItemForm.controls.workHour.value;
    const workHourPrice = this.maintenanceItemForm.controls.price.value;
    const discount = this.maintenanceItemForm.controls.discount.value / 100;
    this.maintenanceItemForm.controls.amount.setValue((workHour * workHourPrice * discount).toFixed(2));
  }
}


