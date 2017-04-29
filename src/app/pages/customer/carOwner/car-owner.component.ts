import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataList } from '../../../shared/models/data-list';
import { CustomerListRequest } from '../../customer/customer.service';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-car-owner',
  templateUrl: './car-owner.component.html',
  styleUrls: ['./car-owner.component.css']
})
export class CarOwnerComponent extends DataList<any>  {
  customerManagementForm: FormGroup;

  params: CustomerListRequest;

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
  }

}
