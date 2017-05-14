import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TypeaheadRequestParams } from 'app/shared/directives';
import { VehicleBrandSearchRequest, VehicleSeriesSearchRequest, VehicleSearchRequest, OrderService } from '../../../reception/order.service';

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
    this.onAddVehicleConfirm.emit(this.vehicleForm.value);
    this.vehicleForm.reset();
  }

  // 从模糊查询下拉列表中选择一个品牌事件处理程序
  onBrandSelect(evt) {
    // 设置当前选择的品牌id
    this.vehicleForm.controls.brandId.setValue(evt.id);

  }
  // 从模糊查询下拉列表中选择一个车系事件处理程序
  onSeriesSelect(evt) {
    // 设置当前选择的车系id
    this.vehicleForm.controls.seriesId.setValue(evt.id);

  }
  // 从模糊查询下拉列表中选择一个车型事件处理程序
  onModelSelect(evt) {
    // 设置当前选择的车系id
    console.log('当前选择的车型', evt);
    this.vehicleForm.controls.vehicleId.setValue(evt.id);
    this.vehicleForm.controls.vehicleName.setValue(evt.name);
  }

  createForm() {
    // 添加车主表单
    this.vehicleForm = this.fb.group({
      plateNo: ['', [Validators.required]],
      brand: ['', [Validators.required]], // 品牌
      series: [{ value: '', disabled: true }, [Validators.required]], // 车系
      vehicleName: [{ value: '', disabled: true }, [Validators.required]], // 车型
      brandId: '',
      seriesId: '',
      vehicleId: '',
      engineNo: '',
      vin: ['', [Validators.required]],
      vehicleColor: '',
      purchaseDate: '',
      validate: '',
      insuranceDue: '',
      insuranceCompany: '',
    });

    // 表单域中的值改变事件监听
    this.vehicleForm.valueChanges.subscribe(data => {
      // 只有表单域合法 保存车主按钮才可用
      this.enableSaveVehicle = this.vehicleForm.valid;
    });

    // 品牌表单域值改变事件监听
    this.vehicleForm.controls.brand.valueChanges.subscribe((newValue) => {
      // 设置当前选择的品牌id为null
      this.vehicleForm.controls.brandId.reset();
      // 设置当前选择的车系id为null
      this.vehicleForm.controls.seriesId.reset();

      this.vehicleForm.controls.series.reset();
      this.vehicleForm.controls.vehicleName.reset();
      this.vehicleForm.controls.series.disable();
      this.vehicleForm.controls.vehicleName.disable();
    });
    // 车系表单域值改变事件监听
    this.vehicleForm.controls.series.valueChanges.subscribe((newValue) => {
      // 设置当前选择的车系id为null
      this.vehicleForm.controls.seriesId.reset();

      this.vehicleForm.controls.vehicleName.reset();
      this.vehicleForm.controls.vehicleName.disable();
    });
    // 车型表单域值改变事件监听
    this.vehicleForm.controls.vehicleName.valueChanges.subscribe((newValue) => {
      this.vehicleForm.controls.vehicleId.reset();
    });
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
