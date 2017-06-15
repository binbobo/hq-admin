import { Component, OnInit, Injector } from '@angular/core';
import { CustomerListRequest } from '../../customer/customer.service';
import { CustomerService } from '../customer.service';
import { DataList } from 'app/shared/models';
import * as moment from 'moment';
import { SweetAlertService } from '../../../../shared/services/sweetalert.service';

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

  // 结束时间参数对象
  endDateParams = {
    createdEndDate: undefined
  }

  // 来源渠道数据
  customerSourceData: any;

  constructor(
    injector: Injector,
    protected sweetAlertService: SweetAlertService,
    protected service: CustomerService) {
    super(injector, service);
    this.params = new CustomerListRequest();

    // 获取来源渠道数据
    this.service.getCustomerSource()
      .subscribe(data => this.customerSourceData = data);
  }

  onSearch() {
    if (this.endDateParams.createdEndDate)
      this.params.createdEndDate = this.endDateParams.createdEndDate + ' 23:59:59.999';
    this.onLoadList();
  }

  customerDel(item) {
    this.sweetAlertService.confirm({
      text: '是否确认删除该条车主信息？',
      type: 'warning'
    }).then(() => {
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
    }, () => {
      // 点击了取消
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
    return !!this.endDateParams.createdEndDate ? this.endDateParams.createdEndDate : moment().toDate();
  }
  public get minCreatedEndDate() {
    if (this.params.createdStartDate) {
      return moment(this.params.createdStartDate).subtract(1, 'd').toDate();
    }
    return '';
  }
  public get maxCreatedEndDate() {
    return moment().toDate();
  }
}
