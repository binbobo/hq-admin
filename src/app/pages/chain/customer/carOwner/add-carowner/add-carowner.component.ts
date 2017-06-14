import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from '../../customer.service';
import { Location } from '@angular/common';
import { HqAlerter } from 'app/shared/directives';
import { SweetAlertService } from '../../../../../shared/services/sweetalert.service';


@Component({
  selector: 'hq-add-carowner',
  templateUrl: './add-carowner.component.html',
  styleUrls: ['./add-carowner.component.css']
})
export class AddCarownerComponent implements OnInit {
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild('customerForm')
  protected customerForm: any;

  // 控制保存车主按钮是否可用
  enableSaveCustomer = false;
  // 保存所有添加的车辆
  newVehiclesData = [];

  // 保存车主加载动画
  generating = false;

  // 当前选择的车辆记录  用于编辑
  selectedVehicle: any;
  vehicleModalTitle: string; // 车辆编辑/添加标题

  constructor(
    protected sweetAlertService: SweetAlertService,
    protected service: CustomerService,
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
    this.enableSaveCustomer = this.customerForm.carOwnerForm.valid && this.newVehiclesData.length >= 0;
    vehicleModal.hide();
  }
  // 删除一条车辆记录 处理程序
  onDelVehicleConfirmHandler(plateNo) {
    this.sweetAlertService.confirm({
      text: '确定要删除当前选择的车辆吗',
      type: 'warn'
    }).then(() => {
      this.newVehiclesData.filter((item, index) => {
        if (item.plateNo === plateNo) {
          this.newVehiclesData.splice(index, 1);
          return;
        }
      });
      this.enableSaveCustomer = this.customerForm.carOwnerForm.valid && this.newVehiclesData.length >= 0;
    }, () => {
      // 点击了取消
    });
  }

  onAddVehicle(vehicleModal) {
    this.vehicleModalTitle = '新增车辆';
    setTimeout(() => {
      vehicleModal.show();
    }, 100);
  }
  onEditVehicle(evt, vehicleModal) {
    this.vehicleModalTitle = '编辑车辆';
    this.selectedVehicle = evt;
    setTimeout(() => {
      vehicleModal.show();
    }, 100);
  }

  // 添加车主
  saveCustomer(lgModal) {
    this.generating = true;

    // 设置保存按钮不可用
    this.enableSaveCustomer = false;

    // 获取表单信息
    const carOwnerBody = this.customerForm.carOwnerForm.value;
    if (!carOwnerBody.birthday) { delete carOwnerBody.birthday; }

    // 添加省份 城市 区县id, name列表
    carOwnerBody.cityIdList = this.customerForm.cityIdList.join(',');
    carOwnerBody.cityNameList = this.customerForm.cityNameList.join(',');

    // 获取车辆信息
    carOwnerBody.customerVehicles = this.newVehiclesData;

    // console.log('提交的车主对象为：', JSON.stringify(carOwnerBody));

    if (!carOwnerBody.id) {
      // 调用后台添加车主接口
      this.service.create(carOwnerBody).then(data => {
        this.addCustomerSuccess();
      }).catch(err => {
        this.addCustomerFailure(err);
      });
    } else {
      // 更新车主  用于  通过模糊查询选择车主
      this.service.update(carOwnerBody).then(data => {
        this.addCustomerSuccess();
      }).catch(err => {
        this.addCustomerFailure(err);
      });
    }
  }
  private addCustomerSuccess() {
    this.alerter.success('创建车主成功');
    this.customerForm.carOwnerForm.reset();
    this.newVehiclesData = [];
    this.customerForm.isProvinceLevelMunicipality = false;

    this.generating = false;
  }
  private addCustomerFailure(err) {
    this.enableSaveCustomer = true;
    this.alerter.error(err, true, 3000);
    this.generating = false;
  }
  ngOnInit() {
  }
}
