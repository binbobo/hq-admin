import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../customer.service';
import { OrderService } from '../../../reception/order.service';
import { Location } from '@angular/common';
import { HqAlerter } from 'app/shared/directives';
import * as moment from 'moment';
import { CustomValidators } from 'ng2-validation';
import { HQ_VALIDATORS } from 'app/shared/shared.module';

@Component({
  selector: 'hq-add-carowner',
  templateUrl: './add-carowner.component.html',
  styleUrls: ['./add-carowner.component.css']
})
export class AddCarownerComponent implements OnInit {
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;

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

  // 是否为直辖市标志
  isProvinceLevelMunicipality = false;

  // 添加车主
  // 1.省市县
  cityIdList = []; // 保存省份,城市, 区县id
  cityNameList = []; // 保存省份,城市, 区县Name

  newVehiclesData = []; // 保存所有添加的车辆

  // 保存车主加载动画
  generating = false;

  // 当前选择的车辆记录  用于编辑
  selectedVehicle: any;

  constructor(
    protected service: CustomerService,
    protected orderService: OrderService,
    private fb: FormBuilder,

    private location: Location,
  ) {
  }

  goBack() {
    this.location.back();
  }

  // 添加一条车辆记录处理程序
  onVehicleConfirmHandler(evt, vehicleModal) {
    const data = evt.data;
    if (evt.isEdit && this.selectedVehicle) {
      // 编辑
      const index = this.newVehiclesData.findIndex((item) => {
        return item.vehicleId === this.selectedVehicle.vehicleId;
      });
      // 使用新的元素替换以前的元素
      this.newVehiclesData.splice(index, 1, data);

      // 清空当前编辑的車车辆
      this.selectedVehicle = null;
    } else {
      // 新增
      this.newVehiclesData.push(data);
    }
    vehicleModal.hide();
  }

  // 删除一条车辆记录 处理程序
  onDelVehicleConfirmHandler(plateNo) {
    if (!confirm('确定要删除当前选择的车辆吗?')) { return; }
    this.newVehiclesData.filter((item, index) => {
      if (item.plateNo === plateNo) {
        this.newVehiclesData.splice(index, 1);
        return;
      }
    });
    this.enableSaveCustomer = this.carOwnerForm.valid && this.newVehiclesData.length > 0;
  }

  // 添加车主
  saveCustomer(lgModal) {
    this.generating = true;

    // 设置保存按钮不可用
    this.enableSaveCustomer = false;

    // 获取表单信息
    const carOwnerBody = this.carOwnerForm.value;
    if (!carOwnerBody.birthday) { delete carOwnerBody.birthday; }

    // 添加省份 城市 区县id, name列表
    carOwnerBody.cityIdList = this.cityIdList.join(',');
    carOwnerBody.cityNameList = this.cityNameList.join(',');

    // 获取车辆信息
    carOwnerBody.customerVehicles = this.newVehiclesData;

    console.log('提交的车主对象为：', JSON.stringify(carOwnerBody));

    // // 调用后台添加车主接口
    this.service.create(carOwnerBody).then(data => {
      // console.log('创建车主成功, 新创建的车主信息为：', JSON.stringify(data));

      // 提示创建车主成功
      this.alerter.success('创建车主成功');
      this.carOwnerForm.reset();
      this.newVehiclesData = [];
      this.isProvinceLevelMunicipality = false;

      this.generating = false;
    }).catch(err => {
      this.enableSaveCustomer = true;
      this.alerter.error(err, true, 3000);
      this.generating = false;
    });
  }
  // 省份选择事件处理程序
  onProvinceChange(provinceValue) {
    console.log('当前选择的省份为：', provinceValue);

    const provinceId = provinceValue.split(',')[0];
    const provinceName = provinceValue.split(',')[1];

    // 判断当前选择的省份是否为直辖市
    if (provinceName.indexOf('北京') > -1 || provinceName.indexOf('天津') > -1 || provinceName.indexOf('重庆') > -1 || provinceName.indexOf('上海') > -1) {
      this.isProvinceLevelMunicipality = true;
    } else {
      this.isProvinceLevelMunicipality = false;
    }

    // 保存选择的省份id和省份名称
    this.cityIdList[0] = provinceId;
    this.cityNameList[0] = provinceName;

    // 根据当前选择的省份去查询其下面的城市列表数据
    this.service.getChildrenData(provinceId)
      .subscribe(citiesData => this.citiesData = citiesData);
  }
  // 城市选择事件处理程序
  onCityChange(cityValue) {
    console.log('当前选择的城市为：', cityValue);

    const cityId = cityValue.split(',')[0];
    const cityName = cityValue.split(',')[1];

    // 保存选择的城市id和城市名称
    this.cityIdList[1] = cityId;
    this.cityNameList[1] = cityName;

    // 根据当前选择的城市去查询其下面的区县列表数据
    this.service.getChildrenData(cityId)
      .subscribe(areasData => this.areasData = areasData);
  }
  // 区县选择事件处理程序
  onAreaChange(areaValue) {
    console.log('当前选择的区县为：', areaValue);

    const areaId = areaValue.split(',')[0];
    const areaName = areaValue.split(',')[1];

    // 保存选择的区县id和区县名称
    this.cityIdList[2] = areaId;
    this.cityNameList[2] = areaName;
  }

  ngOnInit() {
    // 初始化省份数据
    this.service.getProvincesData()
      .subscribe(data => this.provincesData = data);

    this.createForm();
  }

  createForm() {
    // 添加车主表单
    this.carOwnerForm = this.fb.group({
      id: '', // 车主主键 用于更新
      name: ['', [Validators.required]], // 车主
      phone: ['', [Validators.required, HQ_VALIDATORS.mobile]], // 车主手机号
      sex: '', // 车主性别
      birthday: [null, [CustomValidators.date]], // 车主生日
      identityCard: ['', [HQ_VALIDATORS.idCard]], // 身份证号
      tel: ['', [HQ_VALIDATORS.tel]], // 电话
      fax: ['', [HQ_VALIDATORS.tel]], // 传真
      email: ['', [CustomValidators.email]], // 电子邮箱
      province: '', // 省份id,name
      city: '', // 城市id,name
      area: '', // 区县id,name
      address: '' // 详细地址
    });

    // 表单域中的值改变事件监听
    this.carOwnerForm.valueChanges.subscribe(data => {
      // 只有表单域合法 保存车主按钮才可用
      this.enableSaveCustomer = this.carOwnerForm.valid && this.newVehiclesData.length > 0;
    });
  }

  /**
 * 选择车主名称
 * @memberof CarOwnerComponent
 */
  onCustomerNameSelect(evt) {
    console.log('通过车主姓名模糊查询车主下拉选择：', evt);
    // 主键id是否有用

    // 加载车主数据
    this.loadCustomer(evt);
  }

  // 从模糊 查询列表中 选择一条车主记录后 加载客户信息 
  loadCustomer(customer) {
    // 组织省份数据
    let provinceId = '', provinceName = '';
    let cityId = '', cityName = '';
    let areaId = '', areaName = '';
    if (customer.cityIdList && customer.cityNameList) {
      this.cityIdList = customer.cityIdList.split(',');
      this.cityNameList = customer.cityNameList.split(',');

      if (this.cityIdList[0]) {
        provinceId = this.cityIdList[0];
        provinceName = this.cityNameList[0];
        // 如果有省份信息  去查询其下面的城市信息
        this.service.getChildrenData(provinceId)
          .subscribe(citiesData => this.citiesData = citiesData);
      }
      if (this.cityIdList[1]) {
        cityId = this.cityIdList[1];
        cityName = this.cityNameList[1];
        // 如果有城市信息  去查询其下面的区县信息
        this.service.getChildrenData(cityId)
          .subscribe(areasData => this.areasData = areasData);
      }
      if (this.cityIdList[2]) {
        areaId = this.cityIdList[2];
        areaName = this.cityNameList[2];
      }
    } else {
      this.cityIdList = [];
      this.cityNameList = [];
    }
    customer.province = provinceId + ',' + provinceName;
    customer.city = cityId + ',' + cityName;
    customer.area = areaId + ',' + areaName;
    customer.birthday = moment(customer.birthday).format('YYYY-MM-DD');

    // 判断当前选择的省份是否为直辖市
    if (provinceName.indexOf('北京') > -1 || provinceName.indexOf('天津') > -1 || provinceName.indexOf('重庆') > -1 || provinceName.indexOf('上海') > -1) {
      this.isProvinceLevelMunicipality = true;
    } else {
      this.isProvinceLevelMunicipality = false;
    }
    // 初始化车主表单数据
    this.carOwnerForm.patchValue(customer);

    // 初始化车主下面的车辆信息
    this.newVehiclesData = customer.customerVehicles || [];
  }
  /**
 * 选择车主电话
 * @memberof CarOwnerComponent
 */
  onCustomerPhoneSelect(evt) {
    // console.log('通过车主手机号模糊查询车主下拉选择：', evt);
    this.service.get(evt.id).then(customer => {
      console.log('通过车主手机号模糊查询车主车主信息：', customer);
      // 加载车主数据
      this.loadCustomer(customer);
    }).catch(err => {
      this.alerter.error('获取车主信息失败：' + err, true, 3000);
    });
  }

}
