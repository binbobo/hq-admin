import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CustomerListRequest } from '../../customer/customer.service';
import { CustomerService } from '../customer.service';
import { DataList } from 'app/shared/models';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

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

  // 当前选择的车主记录
  selectedCustomer = null;

  // 添加车主
  // 1.省市县
  cityIdList = []; // 保存省份,城市, 区县id
  cityNameList = []; // 保存省份,城市, 区县Name
  // 添加车辆信息
  addNewVehicle = false; // 车辆添加区域是否可见标志]
  newVehiclesData = []; // 保存所有添加的车辆
  newVehicle = null; // 当前编辑的车辆记录
  fuzzySearch: any = {
    brandKeyword: '',
    seriesKeyword: '',
    modelKeyword: '',
  };

  // 根据品牌获取车辆信息异步数据源
  public brandDataSource: Observable<any>; // 可以加品牌model类：Brand
  // 根据车系获取车辆信息异步数据源
  public seriesDataSource: Observable<any>; // 可以加车系model类：Series
  // 根据车型获取车辆信息异步数据源
  public modelDataSource: Observable<any>; // 可以加车型model类：Model

  constructor(
    injector: Injector,
    protected service: CustomerService,

    private fb: FormBuilder) {
    super(injector, service);
    this.params = new CustomerListRequest();

    // 初始化省份数据
    this.service.getProvincesData()
      .subscribe(data => this.provincesData = data);

    // 初始化FormGroup
    this.createForm();

    // 根据品牌获取车辆信息异步数据源初始化
    this.brandDataSource = Observable
      .create((observer: any) => {
        observer.next(this.fuzzySearch.brandKeyword);
      })
      .debounceTime(300)
      .distinctUntilChanged()
      .mergeMap((token: string) => {
        if (!token) {
          return Observable.of([]);
        }
        return this.service.getVehicleByBrand(token);
      }) // 绑定this
      .catch(err => console.log(err));

    // 根据车系获取车辆信息异步数据源初始化
    this.seriesDataSource = Observable
      .create((observer: any) => {
        observer.next(this.fuzzySearch.seriesKeyword);
      })
      .debounceTime(300)
      .distinctUntilChanged()
      .mergeMap((token: string) => {
        if (!token) {
          return Observable.of([]);
        }
        return this.service.getVehicleBySerias(token, this.newVehicle.brandId);
      }) // 绑定this
      .catch(err => console.log(err));

    // 根据车系获取车辆信息异步数据源初始化
    this.modelDataSource = Observable
      .create((observer: any) => {
        observer.next(this.fuzzySearch.modelKeyword);
      })
      .debounceTime(300)
      .distinctUntilChanged()
      .mergeMap((token: string) => {
        if (!token) {
          return Observable.of([]);
        }
        return this.service.getVehicleByModel(token, this.newVehicle.brandId, this.newVehicle.seriesId);
      })
      .catch(err => console.log(err));
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

  // 点击新增维修项目按钮 处理程序
  addNewVehicleHandler() {
    // 初始化当前编辑的维修项目记录
    this.newVehicle = {
      plateNo: '',
      brand: '',
      series: '',
      vehicleName: '',
      engineNo: '',
      vin: '',
      vehicleColor: '',
      purchaseDate: '',
      validate: '',
      insuranceDue: '',
      insuranceCompany: '',

      brandId: null,
      seriesId: null,
      vehicleId: null
    };
    this.fuzzySearch = {
      brandKeyword: '',
      seriesKeyword: '',
      modelKeyword: '',
    };
    // 车辆添加区域可见
    this.addNewVehicle = true;
  }

  // 添加一条车辆记录 确认按钮  处理程序
  onConfirmAddVehicle() {
    // 是否输入车牌号
    if (!this.newVehicle.plateNo) {
      console.log('没有输入车牌号');
      return;
    }
    // 校验数据合法性
    if (!this.newVehicle.vehicleId) {
      console.log('没有选择车型');
      return;
    }
    // 是否输入vin
    if (!this.newVehicle.vin) {
      console.log('没有输入vin');
      return;
    }
    // 是否输入动机号
    if (!this.newVehicle.engineNo) {
      console.log('没有输入动机号');
      return;
    }

    this.newVehiclesData.push(this.newVehicle);
    // 车辆添加区域不可见
    this.addNewVehicle = false;
    this.enableSaveCustomer = true;
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

    this.enableSaveCustomer = true;
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
      // provinceId: '', // 省份id
      // cityId: '', // 城市id
      // areaId: '', // 区县id
      address: '' // 详细地址
    });

    // 表单域中的值改变事件监听
    this.carOwnerForm.valueChanges.subscribe(data => {
      console.log('carOwnerForm value changed', data);
      // 只有表单域合法 生成车主按钮才可用
      this.enableSaveCustomer = this.carOwnerForm.valid;
    });
  }

  // 品牌输入框改变事件
  onBrandBlur(newValue) {
    console.log('brand input blur, new Value:', newValue);
    if (!this.newVehicle.brand || newValue !== this.newVehicle.brand) {
      // 设置当前选择的品牌id为null
      this.newVehicle.brandId = null;

      // 重置车系选择域
      this.newVehicle.series = '';
      this.fuzzySearch.seriesKeyword = '';
      // 车系输入框不可用

      // 设置当前选择的车系id为null
      this.newVehicle.seriesId = null;

      // 重置车型选择域
      this.newVehicle.vehicleName = '';
      this.fuzzySearch.modelKeyword = '';
    }
  }
  // 车系输入框改变事件
  onSeriesBlur(newValue) {
    if (!this.newVehicle.series || newValue !== this.newVehicle.series) {
      // 设置当前选择的车系id为null
      this.newVehicle.seriesId = null;

      // 重置车型选择域
      this.newVehicle.vehicleName = '';
      this.fuzzySearch.modelKeyword = '';
    }
  }
  // 车型输入框改变事件
  onModelBlur(newValue) {
    if (!this.newVehicle.vehicleName || newValue !== this.newVehicle.vehicleName) {
      // 设置当前选择的车型id为null
      this.newVehicle.vehicleId = null;
    }
  }

  // 从模糊查询下拉列表中选择一个品牌事件处理程序
  onBrandSelect(evt: TypeaheadMatch) {
    // 设置当前选择的品牌id
    this.newVehicle.brandId = evt.item.id;
    this.newVehicle.brand = evt.item.name;
  }
  // 从模糊查询下拉列表中选择一个车系事件处理程序
  onSeriesSelect(evt: TypeaheadMatch) {
    // 设置当前选择的车系id
    this.newVehicle.seriesId = evt.item.id;
    this.newVehicle.series = evt.item.name;
  }
  // 从模糊查询下拉列表中选择一个车型事件处理程序
  onModelSelect(evt: TypeaheadMatch) {
    // 设置当前选择的车系id
    console.log('当前选择的车型', evt);

    // 记录车型id
    this.newVehicle.vehicleId = evt.item.id;
    this.newVehicle.vehicleName = evt.item.name;
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

    // // 调用后台添加车主接口
    this.service.create(carOwnerBody).then(data => {
      console.log('创建车主成功, 新创建的车主信息为：', JSON.stringify(data));

      // 隐藏创建车主弹窗
      lgModal.hide();

      // 提示创建车主成功
      this.alerter.success('创建车主成功');
      // 刷新列表
      this.onLoadList();
    }).catch(err => {
      console.log('创建车主失败：' + err);

      this.enableSaveCustomer = true;
      this.alerter.error('创建车主失败');
    });
  }

  /**
   * 新增车主按钮处理程序
   * 
   * @param {any} lgModal 
   * 
   * @memberOf CarOwnerComponent
   */
  addNewCarOwner(lgModal) {
    console.log('新增车主弹框显示');
    // 清空数据
    this.newVehiclesData = [];
    this.carOwnerForm.reset();
    // 清空省份,城市, 区县id, name
    this.cityIdList = [];
    this.cityNameList = [];

    // 
    this.selectedCustomer = null;

    lgModal.show();
  }

  /**
   * 查看客户详情按钮 处理程序
   * @param {any} evt 
   * @param {any} id 车主记录id
   * @param {any} lgModal 模态框
   * 
   * @memberOf CarOwnerComponent
   */
  customerDetail(id, lgModal) {
    // 根据id获取客户详细信息
    this.service.get(id).then(data => {
      console.log('根据客户id获取客户详情数据：', data);

      // 记录当前操作的客户记录
      this.selectedCustomer = data;

      // 显示窗口
      lgModal.show();
    });
  }

  /**
   * 编辑客户车主信息
   * @param id 
   * @param lgModal 
   */
  customerEdit(id, lgModal) {
    // 根据id获取客户详细信息
    this.service.get(id).then(data => {
      console.log('根据客户id获取客户详情数据, 用于编辑：', data);

      // 判断当前编辑的车主是否有城市信息
      if (data.cityIdList.split(',').length > 0) {
        // 重新获取城市信息
        this.service.getChildrenData(data.cityIdList.split(',')[0])
          .subscribe(citiesData => {
            this.citiesData = citiesData;
            if (data.cityIdList.split(',').length > 1) {
              this.service.getChildrenData(data.cityIdList.split(',')[1])
                .subscribe(areasData => this.areasData = areasData);

              // 记录当前操作的客户记录
              this.selectedCustomer = data;
              // 初始化当前编辑的车主下面的车辆信息
              this.newVehiclesData = this.selectedCustomer.customerVehicles;
              // 显示窗口
              lgModal.show();
            } else {
              // 记录当前操作的客户记录
              this.selectedCustomer = data;
              // 初始化当前编辑的车主下面的车辆信息
              this.newVehiclesData = this.selectedCustomer.customerVehicles;
              // 显示窗口
              lgModal.show();
            }
          });
      } else {
        // 记录当前操作的客户记录
        this.selectedCustomer = data;
        // 初始化当前编辑的车主下面的车辆信息
        this.newVehiclesData = this.selectedCustomer.customerVehicles;
        // 显示窗口
        lgModal.show();
      }
    });
  }

}
