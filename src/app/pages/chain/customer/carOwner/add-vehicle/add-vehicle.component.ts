import { Component, OnInit, Output, EventEmitter, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Vehicle } from '../../../reception/order.service';
import { CustomValidators } from 'ng2-validation';
import { HQ_VALIDATORS } from '../../../../../shared/shared.module';

@Component({
  selector: 'hq-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddVehicleComponent implements OnInit {
  vehicleForm: FormGroup;
  // 保存车辆按钮是否可用
  enableSaveVehicle = false;

  @Output() onVehicleCancel = new EventEmitter<any>();
  @Output() onVehicleConfirm = new EventEmitter<any>();
  @Input()
  vehicle: any = null; // 当前编辑的维修项目

  isBrandSelected = false;
  isSeriesSelected = false;
  isVehicleSelected = false;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.createForm();

    // 编辑
    if (this.vehicle) {
      this.vehicleForm.patchValue(this.vehicle);
    }
  }

  onVehicleCancelHandler() {
    this.onVehicleCancel.emit();
  }
  onVehicleConfirmHandler() {
    // 验证数据合法性
    if (!this.vehicleForm.value.vehicleId) {
      alert('请选择车型');
      this.vehicleForm.controls.vehicleName.setValue('');
      return;
    }
    // 日期类型没选的话 不传
    if (!this.vehicleForm.value.purchaseDate) { delete this.vehicleForm.value.purchaseDate; };
    if (!this.vehicleForm.value.validate) { delete this.vehicleForm.value.validate; };
    if (!this.vehicleForm.value.insuranceDue) { delete this.vehicleForm.value.insuranceDue; };
    this.vehicleForm.value.plateNo = this.vehicleForm.value.plateNo.toUpperCase();

    this.onVehicleConfirm.emit({
        data: this.vehicleForm.getRawValue(),
        isEdit: this.vehicle ? true : false
      });
    this.vehicleForm.reset();
  }

  // 从模糊查询下拉列表中选择一个品牌事件处理程序
  onBrandSelect(evt) {
    this.isBrandSelected = true;
    if (this.vehicleForm.controls.series.enabled) {
      this.brandChange();
    }
    // 设置当前选择的品牌id
    this.vehicleForm.controls.brandId.setValue(evt.id);
    this.vehicleForm.controls.brand.setValue(evt.name);

    this.vehicleForm.controls.series.enable();
  }
  // 从模糊查询下拉列表中选择一个车系事件处理程序
  onSeriesSelect(evt) {
    this.isSeriesSelected = true;
    if (this.vehicleForm.controls.vehicleName.enabled) {
      this.seriesChange();
    }
    // 设置当前选择的车系id
    this.vehicleForm.controls.seriesId.setValue(evt.id);
    this.vehicleForm.controls.series.setValue(evt.name);

    this.vehicleForm.controls.vehicleName.enable();
  }
  // 从模糊查询下拉列表中选择一个车型事件处理程序
  onModelSelect(evt) {
    this.isVehicleSelected = true;
    // 设置当前选择的车系id
    console.log('当前选择的车型', evt);
    this.vehicleForm.controls.vehicleId.setValue(evt.id);
    this.vehicleForm.controls.vehicleName.setValue(evt.name);

    this.enableSaveVehicle = this.vehicleForm.valid;
  }

  createForm() {
    // 添加车主表单
    this.vehicleForm = this.fb.group({
      plateNo: ['', [Validators.required, HQ_VALIDATORS.plateNo]],
      brand: ['', [Validators.required]], // 品牌
      series: [{ value: '', disabled: true }, [Validators.required]], // 车系
      vehicleName: [{ value: '', disabled: true }, [Validators.required]], // 车型
      brandId: '',
      seriesId: '',
      vehicleId: '',
      engineNo: ['', [HQ_VALIDATORS.engineNo]],
      vin: ['', [Validators.required, HQ_VALIDATORS.vin]],
      vehicleColor: '',
      purchaseDate: [null, [CustomValidators.date]],
      validate: [null, [CustomValidators.date]],
      insuranceDue: [null, [CustomValidators.date]],
      insuranceCompany: '',
    });

    // 表单域中的值改变事件监听
    this.vehicleForm.valueChanges.subscribe(data => {
      // 只有表单域合法 保存车主按钮才可用
      this.enableSaveVehicle = this.vehicleForm.controls.vehicleId.value && this.vehicleForm.valid;
    });

    // 品牌表单域值改变事件监听
    this.vehicleForm.controls.brand.valueChanges.subscribe((newValue) => {
      if (this.isBrandSelected) {
        this.isBrandSelected = false;
        return;
      }
      // 设置当前选择的品牌id为null
      this.vehicleForm.controls.brandId.reset();
      this.brandChange();
    });

    // 车系表单域值改变事件监听
    this.vehicleForm.controls.series.valueChanges.subscribe((newValue) => {
      if (this.isSeriesSelected) {
        this.isSeriesSelected = false;
        return;
      }
      // 设置当前选择的车系id为null
      this.vehicleForm.controls.seriesId.reset();
      this.seriesChange();
    });
    // 车型表单域值改变事件监听
    this.vehicleForm.controls.vehicleName.valueChanges.subscribe((newValue) => {
      if (this.isVehicleSelected) {
        this.isVehicleSelected = false;
        return;
      }
      this.vehicleForm.controls.vehicleId.reset();
    });
  }

  brandChange() {
    this.vehicleForm.controls.seriesId.reset();
    this.vehicleForm.controls.series.reset();
    this.vehicleForm.controls.series.disable();
    this.vehicleForm.controls.vehicleName.reset();
    this.vehicleForm.controls.vehicleId.reset();
    this.vehicleForm.controls.vehicleName.disable();
  }

  seriesChange() {
    this.vehicleForm.controls.vehicleName.reset();
    this.vehicleForm.controls.vehicleId.reset();
    this.vehicleForm.controls.vehicleName.disable();
  }
}
