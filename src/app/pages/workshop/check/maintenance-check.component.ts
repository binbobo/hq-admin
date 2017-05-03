import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { DataList } from '../../../shared/models/data-list';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StorageKeys, SelectOption } from 'app/shared/models';
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

  // 当前登录用户信息
  public user = null;


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
        this.maintenanceCheckTypes = data;
        // 页面初始化的时候  就要加入状态参数
        this.params.states = this.maintenanceCheckTypes.map(item => item.id);
        // 加载列表
        this.loadList();
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
        if (true) {
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
    // 更新当前操作的维修工项复选框状态
    record.checked = !record.checked;

    // 更新全选复选框状态
    const tmp = this.selectedOrder.serviceOutputs;
    // 选中的维修项目
    const checked = tmp.filter(item => item.checked).length;
    // 验收过的维修项目
    const disabled = tmp.filter(item => item.teamType === '10').length;

    this.selectedOrder.serviceOutputs.checkedAll = (checked + disabled) === tmp.length;
    // 指派  转派按钮是否可用
    this.selectedOrder.serviceOutputs.enableCheck = this.selectedOrder.serviceOutputs.filter(item => item.checked).length > 0;
  }

  /**
   * 维修验收  通过按钮处理程序
   * 
   * @param {any} id
   * 
   * @memberOf MaintenanceCheckComponent
   */
  onOrderCheckPass(id) { }


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
    this.params.states = checkedStatus.map(item => item.id);

    console.log('当前选择的工单状态为：', this.params.states);

    // 执行查询
    this.onLoadList();
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

      // 统计各项费用

      // 工时费： 维修项目金额总和
      this.selectedOrder.workHourFee = data.serviceOutputs.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.workHour * currentValue.price);
      }, 0);
      // 材料费： 维修配件金额总和
      this.selectedOrder.materialFee = data.productOutputs.reduce((accumulator, currentValue) => {
        return accumulator + (currentValue.count * currentValue.price);
      }, 0);
      // 其它费： 0
      this.selectedOrder.otherFee = 0;
      // 总计费： 
      this.selectedOrder.sumFee = this.selectedOrder.workHourFee + this.selectedOrder.materialFee + this.selectedOrder.otherFee;
      // 显示窗口
      modalDialog.show();
    }).catch(err => this.alerter.error(err));
  }
}

