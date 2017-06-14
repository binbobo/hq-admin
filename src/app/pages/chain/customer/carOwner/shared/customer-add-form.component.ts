import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HQ_VALIDATORS } from 'app/shared/shared.module';
import { CustomValidators } from 'ng2-validation';
import { CustomerService } from '../../customer.service';
import * as moment from 'moment';
import { phoneNumberMask } from 'app/pages/chain/chain-shared';

@Component({
  selector: 'hq-customer-add-form',
  templateUrl: './customer-add-form.component.html',
  styleUrls: ['./customer-add-form.component.css']
})
export class CustomerAddFormComponent implements OnInit {
  phoneNumberMask = phoneNumberMask;
  // 保存省份数据
  protected provincesData: any[];
  // 保存城市数据
  protected citiesData: any[];
  // 保存区县数据
  protected areasData: any[];

  carOwnerForm: FormGroup; // 添加车主表单
  isProvinceLevelMunicipality = false;// 是否为直辖市标志
  cityIdList = []; // 省份,城市, 区县id列表
  cityNameList = []; // 省份,城市, 区县Name列表
  // 来源渠道数据
  customerSourceData: any;


  @Output() formValueChanges = new EventEmitter<any>(); // 表单值改变
  @Output() load = new EventEmitter<any>(); // 加载客户信息
  @Input()
  customerId: string; // 客户信息  用于编辑

  constructor(
    private fb: FormBuilder,
    protected service: CustomerService,
  ) { }

  ngOnInit() {
    // 初始化省份数据
    this.service.getProvincesData()
      .subscribe(data => this.provincesData = data);
    // 获取来源渠道数据
    this.service.getCustomerSource()
      .subscribe(data => this.customerSourceData = data);

    this.createForm();
    // 用于编辑车主
    if (this.customerId) {
      this.getCustomerById(this.customerId);
    }
  }

  private createForm() {
    // 添加车主表单
    this.carOwnerForm = this.fb.group({
      source:'', // 来源渠道
      id: '', // 车主主键 用于更新(模糊查询选择车主)
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
      this.formValueChanges.emit(this.carOwnerForm.valid);
    });
  }

  // 省份选择事件处理程序
  onProvinceChange(provinceValue) {
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
    const areaId = areaValue.split(',')[0];
    const areaName = areaValue.split(',')[1];

    // 保存选择的区县id和区县名称
    this.cityIdList[2] = areaId;
    this.cityNameList[2] = areaName;
  }

  /**
  * 选择车主电话
  * @memberof CarOwnerComponent
  */
  onCustomerPhoneSelect(evt) {
    this.getCustomerById(evt.id);
  }
  /**
  * 选择车主电话
  * @memberof CarOwnerComponent
  */

  private getCustomerById(id) {
    this.service.get(id).then(customer => {
      // 加载车主数据
      this.loadCustomer(customer);
    }).catch(err => {
      // console.log('获取车主信息失败：' + err);
    });
  }

  /**
  * 选择车主名称
  * @memberof CarOwnerComponent
  */
  onCustomerNameSelect(evt) {
    // 主键id是否有用

    // 加载车主数据
    this.loadCustomer(evt);
  }

  // 从模糊 查询列表中 选择一条车主记录后 加载客户信息 
  private loadCustomer(customer) {
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

    this.load.emit({
      vehicles: customer.customerVehicles || [], // 初始化车主下面的车辆数据
      isFormValid: this.carOwnerForm.valid
    });
  }
}
