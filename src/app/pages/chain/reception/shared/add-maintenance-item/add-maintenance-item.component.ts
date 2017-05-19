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

  @Input()
  item: any = null; // 当前编辑的维修项目
  @Input()
  services: any = []; // 当前已经选择的维修项目列表

  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;

  constructor(
    private fb: FormBuilder,
    protected service: OrderService,
  ) { }

  ngOnInit() {
    this.createForm();

    console.log('当前已经选择的维修项目列表为：', this.services);
    // 编辑
    if (this.item) {
      this.maintenanceItemForm.patchValue(this.item);
    }
  }

  serviceTypeaheadOnSelect(evt) {
    this.maintenanceItemForm.controls.serviceId.setValue(evt.id);
    this.maintenanceItemForm.controls.serviceName.setValue(evt.name);
  }

  onCancelHandler() {
    this.onCancel.emit();
  }
  onConfirmHandler() {
    if (!this.maintenanceItemForm.value.serviceId) {
      const index = this.services.findIndex(item => item.name === this.maintenanceItemForm.value.serviceName);
      if (index > -1) {
        alert('当前输入的维修项目已经添加过了, 如需编辑, 请去编辑页面');
        return;
      } else {
        // 添加维修项目
        this.service.createMaintenanceItem({ name: this.maintenanceItemForm.value.serviceName })
          .then(data => {
            this.alerter.success('新建维修项目成功, 返回的数据为：', data);
            this.maintenanceItemForm.value.serviceId = data.id;


            // 验证数据合法性
            this.onConfirm.emit({
              data: this.maintenanceItemForm.getRawValue(), // 维修项目数据
              isEdit: this.item ? true : false  // 是否为编辑标志
            });
          }).catch(err => {
            this.alerter.error('新建维修项目失败：' + err + '请重新输入维修项目名称');
          });
      }
    } else {
      // 验证数据合法性
      this.onConfirm.emit({
        data: this.maintenanceItemForm.getRawValue(),
        isEdit: this.item ? true : false
      });
    }

  }

  createForm() {
    // 保留一位小数正则
    const regex = /^[0-9]+([.]{1}[0-9]{1})?$/;

    this.maintenanceItemForm = this.fb.group({
      serviceName: ['', [Validators.required]],
      serviceId: [''],
      type: 1, // 1表示维修项目/
      workHour: ['', Validators.compose([Validators.required, Validators.pattern(regex)])],
      price: ['', Validators.compose([Validators.required, Validators.pattern(regex)])],
      discount: [100, [Validators.required, CustomValidators.digits, CustomValidators.range([0, 100])]],
      amount: [{ value: '', disabled: true }],
      operationTime: [{ value: moment().format('YYYY-MM-DD HH:mm:ss'), disabled: true }],
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
    this.maintenanceItemForm.controls.amount.patchValue((workHour * workHourPrice * discount).toFixed(2), { emitEvent: false });
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
        for (let i = 0; i < this.services.length; i++) {
          const index = pagedData.data.findIndex(item => item.id === this.services[i].id);
          if (index > -1) {
            pagedData.data.splice(index, 1);
          }
        }
        return pagedData;
      });
    };
  }
}


