import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CustomerService, CustomerNameSearchRequest, CustomerPhoneSearchRequest } from '../../customer.service';
import { OrderService } from '../../../reception/order.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { TypeaheadRequestParams, HqAlerter } from 'app/shared/directives';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'hq-edit-carowner',
  templateUrl: './edit-carowner.component.html',
  styleUrls: ['./edit-carowner.component.css']
})
export class EditCarownerComponent implements OnInit {
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

  // 添加车主
  // 1.省市县
  cityIdList = []; // 保存省份,城市, 区县id
  cityNameList = []; // 保存省份,城市, 区县Name

  newVehiclesData = []; // 保存所有添加的车辆

  constructor(
    protected service: CustomerService,
    protected orderService: OrderService,
    private fb: FormBuilder,

    private route: ActivatedRoute,
    private location: Location,
  ) {

  }

  goBack() {
    this.location.back();
  }
  // 添加一条车辆记录处理程序
  onAddVehicleConfirmHandler(evt) {
    console.log('编辑车辆信息', evt);
    setTimeout(() => {
      this.newVehiclesData.push(evt);
    }, 500);
  }

  // 删除一条车辆记录 处理程序
  onDelVehicleConfirmHandler(plateNo) {
    //
    this.newVehiclesData.filter((item, index) => {
      if (item.plateNo === plateNo) {
        this.newVehiclesData.splice(index, 1);
        return;
      }
    });

    this.enableSaveCustomer = true;
  }

  // 添加车主
  saveCustomer(lgModal) {
    // 设置保存按钮不可用
    this.enableSaveCustomer = false;

    // 获取表单信息
    const carOwnerBody = this.carOwnerForm.value;

    // 添加省份 城市 区县id, name列表
    carOwnerBody.cityIdList = this.cityIdList.join(',');
    carOwnerBody.cityNameList = this.cityNameList.join(',');

    // 获取车辆信息
    carOwnerBody.customerVehicles = this.newVehiclesData;

    console.log('提交的车主对象为：', JSON.stringify(carOwnerBody));


    // 调用后台更新车主接口
    this.service.update(carOwnerBody).then(data => {
      console.log('更新车主成功, 更新后的车主对象为：', JSON.stringify(data));

      // 提示更新车主成功
      this.alerter.success('更新车主成功');
      this.carOwnerForm.reset();
      this.newVehiclesData = [];

      // 返回车主列表
      this.goBack();
    }).catch(err => {
      console.log('更新车主失败：' + err);

      this.enableSaveCustomer = true;
      this.alerter.error('更新车主失败');
    });
  }
  // 省份选择事件处理程序
  onProvinceChange(provinceValue) {
    console.log('当前选择的省份为：', provinceValue);

    const provinceId = provinceValue.split(',')[0];
    const provinceName = provinceValue.split(',')[1];

    console.log('testse', this.carOwnerForm.value.cityIdList);

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
    // 创建表单
    this.createForm();
    // 获取客户id参数
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      this.service.get(id)
        .then(data => {
          console.log('当前要编辑的车主详情数据为：', data);
          // 加载客户信息
         this.loadCustomer(data);
        })
        .catch(err => console.log(err));
    });
  }

  createForm() {
    // 添加车主表单
    this.carOwnerForm = this.fb.group({
      id: '', // 车主主键 用于更新
      name: '', // 车主
      phone: '', // 车主手机号
      sex: '', // 车主性别
      birthday: '', // 车主生日
      identityCard: '', // 身份证号
      tel: '', // 电话
      fax: '', // 传真
      email: '', // 电子邮箱
      province: '', // 省份id,name
      city: '', // 城市id,name
      area: '', // 区县id,name
      address: '' // 详细地址
    });

    // 表单域中的值改变事件监听
    this.carOwnerForm.valueChanges.subscribe(data => {
      // 只有表单域合法 保存车主按钮才可用
      this.enableSaveCustomer = this.carOwnerForm.valid;
    });
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
    // 初始化车主表单数据
    this.carOwnerForm.patchValue(customer);

    // 初始化车主下面的车辆信息
    this.newVehiclesData = customer.customerVehicles || [];
  }

}
