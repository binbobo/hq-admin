import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CustomerListRequest } from '../../customer/customer.service';
import { CustomerService } from '../customer.service';
import { DataList } from 'app/shared/models';

@Component({
  selector: 'app-car-owner',
  templateUrl: './car-owner.component.html',
  styleUrls: ['./car-owner.component.css']
})
export class CarOwnerComponent extends DataList<any>  {
  // 车主列表查询表单
  customerManagementForm: FormGroup;
  // 车主列表查询参数
  params: CustomerListRequest;
  // 添加车主表单
  carOwnerForm: FormGroup;
  // 控制保存车主按钮是否可用
  enableSaveCustomer = false;

  // 保存省份数据
  provincesData: any[];
  // 保存城市数据
  citiesData: any[];
  // 保存区县数据
  areasData: any[];

  // 为车主添加车辆信息
  addNewVehicle = false; // 车辆添加区域是否可见标志
  newVehiclesData = []; // 保存所有添加的车辆
  newVehicle = null; // 当前编辑的车辆记录

  constructor(
    injector: Injector,
    protected service: CustomerService,

    private fb: FormBuilder) {
    super(injector, service);
    this.params = new CustomerListRequest();

    // 初始化省份数据
    this.service.getProvincesData()
      .subscribe(data => this.provincesData = data);

    this.createForm();
  }

  // 省份选择事件处理程序
  onProvinceChange(provinceId) {
    console.log('当前选择的省份Id为：', provinceId);

    // 根据当前选择的省份去查询其下面的城市列表数据
    this.service.getChildrenData(provinceId)
      .subscribe(citiesData => this.citiesData = citiesData);
  }

  // 省份选择事件处理程序
  onCityChange(cityId) {
    console.log('当前选择的城市Id为：', cityId);

    // 根据当前选择的城市去查询其下面的区县列表数据
    this.service.getChildrenData(cityId)
      .subscribe(areasData => this.areasData = areasData);
  }

  // 点击新增维修项目按钮 处理程序
  addNewVehicleHandler() {
    // 初始化当前编辑的维修项目记录
    this.newVehicle = {
      plateNo: '',
      brand: '',
      series: '',
      model: '',
      vin: '',
      vehicleColor: '',
      purchaseDate: '',
      validate: '',
      insuranceDue: '',
      insuranceCompany: ''
    };
    // 车辆添加区域可见
    this.addNewVehicle = true;
  }

  // 添加一条车辆记录 确认按钮  处理程序
  onConfirmAddVehicle() {
    // 校验数据合法性

    this.newVehiclesData.push(this.newVehicle);
    // 车辆添加区域不可见
    this.addNewVehicle = false;
  }



  // 删除一条车辆记录 处理程序
  onConfirmDelVehicle(plateNo) {
    //
    this.newVehiclesData.filter((item, index) => {
      if (item.plateNo === plateNo) {
        this.newVehiclesData.splice(index, 1);
        return;
      }
    });
  }

  createForm() {
    // 车主列表查询表单
    this.customerManagementForm = this.fb.group({
      plateNo: '', // 车牌号
      name: '', // 车主
      phone: '', // 车主电话
      createdStartDate: '', // 建档开始日期
      createdEndDate: '', // 建档结束日期
    });

    // 添加车主表单
    this.carOwnerForm = this.fb.group({
      plateNo: '', // 车牌号
      name: '', // 车主
      phone: '', // 车主手机号
      sex: '', // 车主性别
      birthday: '', // 车主生日
      identityCard: '', // 身份证号
      tel: '', // 电话
      fax: '', // 传真
      email: '', // 电子邮箱
      province: '', // 省份id
      city: '', // 城市id
      area: '', // 区县id
      address: '' // 详细地址
    });

    // 表单域中的值改变事件监听
    this.carOwnerForm.valueChanges.subscribe(data => {
      console.log('carOwnerForm value changed', data);
      // 只有表单域合法 生成车主按钮才可用
      this.enableSaveCustomer = this.carOwnerForm.valid;
    });
  }

  // 添加车主
  saveCustomer() {
    // 获取表单信息

    // 获取车辆信息

    // 调用后台添加车主接口
  }


  /**
   * 查看客户详情按钮 处理程序
   * @param {any} evt 
   * @param {any} id 车主记录id
   * @param {any} lgModal 模态框
   * 
   * @memberOf CarOwnerComponent
   */
  customerDetail(evt, id, lgModal) {
    evt.preventDefault();
    lgModal.show();
  }

}
