import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TypeaheadRequestParams } from 'app/shared/directives';
import { VehicleBrandSearchRequest, VehicleSeriesSearchRequest, VehicleSearchRequest, OrderService, Vehicle } from '../../../reception/order.service';
import { CustomValidators } from 'ng2-validation';

@Component({
  selector: 'hq-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {
  vehicleForm: FormGroup;
  // 保存车辆按钮是否可用
  enableSaveVehicle = false;

  @Output() onAddVehicleCancel = new EventEmitter<any>();
  @Output() onAddVehicleConfirm = new EventEmitter<any>();

  isBrandSelected = false;
  isSeriesSelected = false;
  isVehicleSelected = false;

  regex = {
    plateNo: /^[\u4e00-\u9fa5]{1}[A-Za-z]{1}[A-Za-z_0-9]{5}$/,
    vin: /^[A-HJ-NPR-Z\d]{8}[\dX][A-HJ-NPR-Z\d]{2}\d{6}$/,
    engineNo: /^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$/
  };

  formValadationErrors = {
    common: {
      required: '{name}不能为空',
      pattern: '无效的{name}',
      date: '非法的日期类型',
    }
  };

  constructor(
    private fb: FormBuilder,
    protected orderService: OrderService,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  onAddVehicleCancelHandler() {
    this.onAddVehicleCancel.emit();
  }
  onAddVehicleConfirmHandler() {
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
    this.onAddVehicleConfirm.emit(this.vehicleForm.value);
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
      plateNo: ['', Validators.compose([Validators.required, Validators.pattern(this.regex.plateNo)])],
      brand: ['', [Validators.required]], // 品牌
      series: [{ value: '', disabled: true }, [Validators.required]], // 车系
      vehicleName: [{ value: '', disabled: true }, [Validators.required]], // 车型
      brandId: '',
      seriesId: '',
      vehicleId: '',
      engineNo: ['', Validators.compose([Validators.pattern(this.regex.engineNo)])],
      vin: ['', Validators.compose([Validators.required, Validators.pattern(this.regex.vin)])],
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

  // 定义车辆模糊查询要显示的列
  public get vehicleTypeaheadColumns() {
    return [
      { name: 'name', title: '名称' },
    ];
  }
  // 根据品牌名称模糊查询数据源
  public get brandTypeaheadSource() {
    return (params: TypeaheadRequestParams) => {
      const p = new VehicleBrandSearchRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.orderService.getVehicleByBrand(p);
    };
  }
  // 根据车系名称模糊查询数据源
  public get seriesTypeaheadSource() {
    return (params: TypeaheadRequestParams) => {
      const p = new VehicleSeriesSearchRequest(params.text, this.vehicleForm.value.brandId);
      p.setPage(params.pageIndex, params.pageSize);
      return this.orderService.getVehicleBySeries(p);
    };
  }
  // 根据车型名称模糊查询数据源
  public get modelTypeaheadSource() {
    return (params: TypeaheadRequestParams) => {
      const p = new VehicleSearchRequest(params.text, this.vehicleForm.value.brandId, this.vehicleForm.value.seriesId);
      p.setPage(params.pageIndex, params.pageSize);
      return this.orderService.getVehicleByModel(p);
    };
  }

}
