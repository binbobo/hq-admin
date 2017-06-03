import { Component, OnInit, Injector } from '@angular/core';
import { CustomerListRequest } from '../../customer/customer.service';
import { CustomerService } from '../customer.service';
import { DataList } from 'app/shared/models';
import * as moment from 'moment';

@Component({
  selector: 'app-car-owner',
  templateUrl: './car-owner.component.html',
  styleUrls: ['./car-owner.component.css'],
})
export class CarOwnerComponent extends DataList<any>  {
  // 车主列表查询参数
  params: CustomerListRequest;

  // 当前选择的车主记录
  selectedCustomer = null;
  // 导出加载动画
  generating = false;

  constructor(
    injector: Injector,
    protected service: CustomerService) {
    super(injector, service);
    this.params = new CustomerListRequest();
  }

  customerDel(item) {
    if (!confirm('确定要删除当前选择的车主记录吗?')) {
      return;
    }

    item.deleteGenerating = true;
    // 根据id删除客户详细信息记录
    this.service.delete(item.id).then(data => {

      this.alerter.success('删除客户记录成功!', true, 2000);
      item.deleteGenerating = false;
      // 刷新车主列表
      this.onLoadList();
    }).catch(err => {
      this.alerter.error('删除客户记录失败: ' + err, true, 2000);
      item.deleteGenerating = false;
    });
  }

  /**
   * 查看客户详情按钮 处理程序
   * @param {any} item 车主记录id
   * @param {any} lgModal 模态框
   * 
   * @memberOf CarOwnerComponent
   */
  customerDetail(item, lgModal) {
    item.detailGenerating = true;
    // 清空上次详情记录
    this.selectedCustomer = null;

    // 根据id获取客户详细信息
    this.service.get(item.id).then(data => {
      // 记录当前操作的客户记录
      this.selectedCustomer = data;

      item.detailGenerating = false;
      // 显示窗口
      lgModal.show();
    }).catch(err => {
      this.alerter.error('获取客户信息失败: ' + err, true, 2000);
      item.detailGenerating = false;
    });
  }

  // 导出当前查询条件下的车主信息
  export() {
    this.generating = true;
    this.service.export(this.params).then(() => {
      this.generating = false;
    }).catch(err => {
      this.alerter.error('导出车主列表失败: ' + err, true, 2000);
      this.generating = false;
    });
  }

  public get maxCreatedStartDate() {
    return this.params.createdEndDate || moment().format('YYYY-MM-DD');
  }
  public get minCreatedEndDate() {
    return this.params.createdStartDate || '';
  }
  public get maxCreatedEndDate() {
    return moment().format('YYYY-MM-DD');
  }
}
