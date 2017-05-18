import { Component, OnInit, Injector } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CustomerListRequest } from '../../customer/customer.service';
import { CustomerService } from '../customer.service';
import { DataList } from 'app/shared/models';

@Component({
  selector: 'app-car-owner',
  templateUrl: './car-owner.component.html',
  styleUrls: ['./car-owner.component.css'],
})
export class CarOwnerComponent extends DataList<any>  {

  // 车主列表查询表单
  customerManagementForm: FormGroup;
  // 车主列表查询参数
  params: CustomerListRequest;

  // 当前选择的车主记录
  selectedCustomer = null;

  constructor(
    injector: Injector,
    protected service: CustomerService,

    private fb: FormBuilder) {
    super(injector, service);
    this.params = new CustomerListRequest();

    // 初始化FormGroup
    this.createForm();
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
    // 清空上次详情记录
    this.selectedCustomer = null;

    // 根据id获取客户详细信息
    this.service.get(id).then(data => {
      console.log('根据客户id获取客户详情数据：', data);

      // 记录当前操作的客户记录
      this.selectedCustomer = data;

      // 显示窗口
      lgModal.show();
    });
  }

  // 导出当前查询条件下的车主信息
  export() {
    this.service.export(this.params).then(() => {
      console.log('导出客户车主信息成功！');
    });
  }
}
