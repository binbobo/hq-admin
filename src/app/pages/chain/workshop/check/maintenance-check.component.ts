import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { StorageKeys, SelectOption, DataList } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';
import { WorkshopListRequest, WorkshopService } from '../workshop.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { numberMask } from 'app/pages/chain/chain-shared';
import { HQ_VALIDATORS } from "app/shared/shared.module";
import { CustomValidators } from 'ng2-validation';
import { ModalDirective } from 'ngx-bootstrap';


@Component({
  selector: 'app-check-order',
  templateUrl: './maintenance-check.component.html',
  styleUrls: ['./maintenance-check.component.css'],
})

export class MaintenanceCheckComponent extends DataList<any> implements OnInit {
  mileageMask = numberMask;
  // 查询参数对象
  params: WorkshopListRequest;

  // 保存维修验收类型数据
  public maintenanceCheckTypes;

  // 当前选择的工单记录   用于查看工单详情  执行作废等功能
  selectedOrder = null;
  isDetailModalShown = false; // 详情弹框是否可见

  statistics: any = null; // 各种状态数量统计
  // 执行验收操作加载动画
  generating = false;

  mileageForm: FormGroup;
  @ViewChild('checkModal')
  checkModal: ModalDirective;

  constructor(injector: Injector,
    private fb: FormBuilder,
    protected service: WorkshopService) {
    super(injector, service);
    this.params = new WorkshopListRequest();

    this.createForm();
  }

  ngOnInit() {
    // 解决参数缓存的问题
    this.lazyLoad = true;
    // 调用父类的初始化方法
    super.ngOnInit();
    // 初始化维修验收类型数据
    this.service.getMaintenanceCheckTypes()
      .subscribe(data => {
        this.maintenanceCheckTypes = [{
          id: 'all',
          value: '全部'
        }].concat(data);
        // 页面初始化的时候  就要加入状态参数
        this.params.status = this.maintenanceCheckTypes
          .filter(item => item.id !== 'all')
          .map(item => item.id);
        // 加载列表
        this.load();
      });

  }

  createForm() {
    this.mileageForm = this.fb.group({
      leaveMileage: ['', [Validators.required]], // 出厂里程
    });
  }

  /**
   * 维修验收全选/反选事件处理程序
   * @param evt 
   */
  toggleCheckboxAll(cb) {
    // 更新全选复选框状态
    this.selectedOrder.serviceOutputs.checkedAll = cb.checked;
    // 更新维修工项复选框状态
    if (cb.checked) {
      this.selectedOrder.serviceOutputs.map(item => {
        // 如果没有验收  也就是复选框可用 设置为选中状态
        if (item.teamType !== 6) {
          item.checked = true;
        }
      });
    } else {
      // 全部设置为未选中
      this.selectedOrder.serviceOutputs.map(item => {
        item.checked = false;
      });
    }
    // 通过按钮是否可用
    this.selectedOrder.serviceOutputs.enableBtn = this.isCheckPassBtnEnable();
  }

  /**
  * 复选框切换事件
  * @param record 
  */
  toggleCheckbox(record) {
    if (record.teamType === 6) {
      // 已验收的不可以再操作
      return false;
    }
    // 更新当前操作的维修工项复选框状态
    record.checked = !record.checked;

    // 更新全选复选框状态
    const tmp = this.selectedOrder.serviceOutputs;
    // 选中的维修项目
    const checked = tmp.filter(item => item.checked).length;
    // 验收过的维修项目
    const disabled = tmp.filter(item => item.teamType === 6).length;

    this.selectedOrder.serviceOutputs.checkedAll = (checked + disabled) === tmp.length;
    // 通过按钮是否可用
    this.selectedOrder.serviceOutputs.enableBtn = this.isCheckPassBtnEnable();
  }

  private isCheckPassBtnEnable() {
    return this.mileageForm.valid && this.selectedOrder.serviceOutputs.filter(item => item.checked).length > 0;
  }

  /**
   * 维修验收  通过按钮处理程序
   * 
   * @param {any} id
   * 
   * @memberOf MaintenanceCheckComponent
   */
  onOrderCheckPass() {
    this.generating = true;

    // 获取选择的工项列表
    const maintenanceItemIds = this.selectedOrder.serviceOutputs.filter(item => item.checked).map(item => item.id);

    // 判断是否选择维修工项
    if (maintenanceItemIds.length === 0) {
      this.alerter.error('您还未选择任何维修工项, 请选择维修工项！', true, 3000);
      return;
    }
    // 调用接口  执行通过验收动作
    this.service.update({ ids: maintenanceItemIds, leaveMileage: this.mileageForm.value.leaveMileage }).then(() => {
      // 修改操作记录的teamType为6
      for (let j = 0; j < maintenanceItemIds.length; j++) {
        for (let i = 0; i < this.selectedOrder.serviceOutputs.length; i++) {
          if (this.selectedOrder.serviceOutputs[i].id === maintenanceItemIds[j]) {
            // 设置工项的状态为 已验收
            this.selectedOrder.serviceOutputs[i].teamType = 6;
            // 取消已选中的工项的选中状态
            this.selectedOrder.serviceOutputs[i].checked = false;
            break;
          }
        }
      }
      // 设置验收操作按钮不可用
      this.selectedOrder.serviceOutputs.checkedAll = false;
      this.selectedOrder.serviceOutputs.enableBtn = false;
      // 验收通过
      this.alerter.success('执行验收通过操作成功！', true, 3000);
      this.generating = false;

      // 判断是否所有工项都验收通过  如果是，隐藏弹框
      if (this.selectedOrder.serviceOutputs.filter(m => m.teamType !== 6).length <= 0) {
        this.checkModal.hide();
      }
      // 刷新列表
      this.load();
    }).catch(err => {
      this.alerter.error('执行验收通过操作失败：' + err, true, 3000);
      this.generating = false;
    });
  }


  /**
  * 根据条件查询工单数据
  * @memberOf OrderListComponent
  */
  onSearch(evt) {
    this.params.status = evt.chechedStatusIds;
    this.params.keyword = evt.keyword;
    // 执行查询
    this.load();
  }

  // 加载派工列表
  load() {
    this.statistics = null;

    this.index = 1;
    this.params.setPage(1, this.size);
    this.loadList().then((result: any) => {
      if (!result || !result.tabList) { return; }
      this.statistics = {};
      // 统计各种状态下面的工单数量
      result.tabList.forEach(item => {
        // 处理全部状态
        if (!item.status) {
          this.statistics['all'] = item.count;
        } else {
          this.statistics[item.status] = item.count;
        }
      });
    });
  }

  private getOrderDetailSuccess(item, data) {
    item.checkGenerating = false;
    this.checkModal.show();
    this.isDetailModalShown = true;
    // 默认带出进厂里程
    this.mileageForm.controls.leaveMileage.setValue(data.mileage);
    this.mileageForm.controls.leaveMileage.setValidators([Validators.required, HQ_VALIDATORS.mileage, CustomValidators.gte(data.mileage)]);
  }

  /**
  * 点击工单详情按钮处理程序
  * @param {any} item
  * 
  * @memberOf OrderListComponent
  */
  orderDetailsHandler(item) {
    item.checkGenerating = true;

    // 根据id获取工单详细信息
    this.service.get(item.id).then(data => {
      // 记录当前操作的工单记录
      this.selectedOrder = data;
      // 验收按钮是否可用标志
      this.selectedOrder.serviceOutputs.enableBtn = false;
      // 全选复选框是否选中标志
      this.selectedOrder.serviceOutputs.checkedAll = false;

      // 判断是否有预检单id
      if (data.preCheckId) {
        this.service.getPreCheckOrderInfoByPreCheckId(data.preCheckId).then(preCheckOrder => {
          this.selectedOrder.preCheckOrder = preCheckOrder;
          this.selectedOrder.preCheckOrder.emptyText = '暂无';

          this.getOrderDetailSuccess(item, data);
        }).catch(err => {
          this.alerter.error(err, true, 2000);
          item.checkGenerating = false;
        });
      } else {
        this.getOrderDetailSuccess(item, data);
      }
    }).catch(err => {
      this.alerter.error('获取工单信息失败: ' + err, true, 3000);
      item.checkGenerating = false;
    });
  }
}

