import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StorageKeys, SelectOption, DataList } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';
import { WorkshopListRequest, WorkshopService } from '../workshop.service';


@Component({
  selector: 'app-check-order',
  templateUrl: './maintenance-check.component.html',
  styleUrls: ['./maintenance-check.component.css'],
})

export class MaintenanceCheckComponent extends DataList<any> implements OnInit {
  // 表单
  checkOrderForm: FormGroup;

  // 查询参数对象
  params: WorkshopListRequest;

  // 保存维修验收类型数据
  public maintenanceCheckTypes;

  // 当前选择的工单记录   用于查看工单详情  执行作废等功能
  selectedOrder = null;
  isDetailModalShown = false; // 详情弹框是否可见

  // 当前登录用户信息
  public user = null;

  statistics: any = null; // 各种状态数量统计


  constructor(injector: Injector,
    protected service: WorkshopService,
    private fb: FormBuilder) {
    super(injector, service);
    this.params = new WorkshopListRequest();

    // 获取当前登录用户信息
    this.user = JSON.parse(sessionStorage.getItem(StorageKeys.Identity));
    console.log('当前登陆用户: ', this.user);

    // 创建表单
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
    this.checkOrderForm = this.fb.group({
      keyword: '', // 车牌号
    });
  }

  /**
    * 维修验收全选/反选事件处理程序
    * @param evt 
    */
  toggleCheckboxAll(cb) {
    console.log('维修验收切换全选复选框', cb.checked);
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
    // 指派  转派按钮是否可用
    this.selectedOrder.serviceOutputs.enableCheck = this.selectedOrder.serviceOutputs.filter(item => item.checked).length > 0;
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
    const disabled = tmp.filter(item => item.teamType === '10').length;

    this.selectedOrder.serviceOutputs.checkedAll = (checked + disabled) === tmp.length;
    // 同意按钮是否可用
    this.selectedOrder.serviceOutputs.enableCheck = this.selectedOrder.serviceOutputs.filter(item => item.checked).length > 0;
  }

  /**
   * 维修验收  通过按钮处理程序
   * 
   * @param {any} id
   * 
   * @memberOf MaintenanceCheckComponent
   */
  onOrderCheckPass() {
    // 获取选择的工项列表
    const maintenanceItemIds = this.selectedOrder.serviceOutputs.filter(item => item.checked).map(item => item.id);
    console.log('选择的工项列表为：', maintenanceItemIds);
    // 判断是否选择维修工项
    if (maintenanceItemIds.length === 0) {
      this.alerter.warn('请选择维修工项！');
      return;
    }
    // 调用接口  执行通过验收动作
    this.service.update({ ids: maintenanceItemIds }).then(() => {
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
      this.selectedOrder.serviceOutputs.enableCheck = false;
      // 验收通过
      this.alerter.success('执行验收通过操作成功！');

      // 刷新列表
      this.load();
    }).catch(err => this.alerter.error(err));
  }


  /**
 * 根据条件查询工单数据
 * @memberOf OrderListComponent
 */
  onSearch() {
    // 组织工单状态数据
    let checkedStatus = this.maintenanceCheckTypes.filter(item => item.checked);
    // 没选的话   查询所有
    if (checkedStatus.length === 0) {
      checkedStatus = this.maintenanceCheckTypes;
    }
    this.params.status = checkedStatus.filter(item => item.id !== 'all').map(item => item.id);

    console.log('当前选择的工单状态为：', this.params.status);

    // 执行查询
    this.load();
  }

  // 加载派工列表
  load() {
    this.statistics = null;

    this.params.setPage(1);
    this.loadList().then((result: any) => {
      console.log('维修验收列表统计数据：', result.tabList);
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


  /**
     * 状态改变事件处理程序
     * @param type
     */
  onStatusChange(type) {
    type.checked = !type.checked;

    if (type.id === 'all') {
      this.maintenanceCheckTypes.map(item => item.checked = type.checked);
    } else {
      if (!type.checked) {
        this.maintenanceCheckTypes[0].checked = false;
      } else {
        const len = this.maintenanceCheckTypes.filter(item => item !== type && item.id !== 'all' && item.checked).length;
        if (len === this.maintenanceCheckTypes.length - 2) {
          this.maintenanceCheckTypes[0].checked = true;
        }
      }
    }
  }

  /**
* 点击工单详情按钮处理程序
* @param {any} id 
* @param {any} modalDialog 
* 
* @memberOf OrderListComponent
*/
  orderDetailsHandler(evt, id, modalDialog) {
    evt.preventDefault();

    // 根据id获取工单详细信息
    this.service.get(id).then(data => {
      console.log('根据工单id获取工单详情数据：', data);

      // 记录当前操作的工单记录
      this.selectedOrder = data;
      // 指派按钮是否可用标志
      this.selectedOrder.serviceOutputs.enableCheck = false;
      // 全选复选框是否选中标志
      this.selectedOrder.serviceOutputs.checkedAll = false;

      // 显示窗口
      modalDialog.show();
      this.isDetailModalShown = true;
    }).catch(err => this.alerter.error(err));
  }
}

