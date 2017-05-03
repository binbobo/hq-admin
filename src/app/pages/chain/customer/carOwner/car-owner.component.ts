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
  customerManagementForm: FormGroup;

  params: CustomerListRequest;

  carOwnerForm: FormGroup;

  // ng2-smart-table相关配置
  // 维修项目表头
  maintanceItemSettings = {
    columns: {
      plateNo: {
        title: '车牌号',
      },
      brand: {
        title: '品牌',
      },
      series: {
        title: '车系'
      },
      model: {
        title: '车型'
      },
      motivationNo: {
        title: '动机号'
      },
      vin: {
        title: 'VIN',
      },
      color: {
        title: '车身颜色'
      },
      buyDate: {
        title: '购车日期'
      },
      validate: {
        title: '验车时间'
      },
      insuranceDueDate: {
        title: '保险到期日期',
      },
      insuranceCompany: {
        title: '保险公司',
      }
    }
  };

  constructor(
    injector: Injector,
    protected service: CustomerService,

    private fb: FormBuilder) {
    super(injector, service);
    this.params = new CustomerListRequest();

    this.createForm();
  }

  createForm() {
    this.customerManagementForm = this.fb.group({
      plateNo: '', // 车牌号
      customerName: '', // 车主
      phone: '', // 车主电话
      enterStoreTimeStart: '', // 建档开始时间
      enterStoreTimeEnd: '', // 建档结束时间
    });

    this.carOwnerForm = this.fb.group({
      plateNo: '', // 车牌号
      customerName: '', // 车主
      phone: '', // 车主电话
      enterStoreTimeStart: '', // 建档开始时间
      enterStoreTimeEnd: '', // 建档结束时间
    });
  }

}
