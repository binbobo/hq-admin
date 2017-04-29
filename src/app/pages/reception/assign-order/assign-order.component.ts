import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { DataList } from '../../../shared/models/data-list';
import { AssignService, AssignListRequest } from '../assign.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StorageKeys, SelectOption } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';
import * as fileSaver from 'file-saver';


@Component({
    selector: 'app-assign-order',
    templateUrl: './assign-order.component.html',
    styleUrls: ['./assign-order.component.css'],
})

export class AssignOrderComponent extends DataList<any> implements OnInit {
    // 表单
    assignOrderForm: FormGroup;

    // 查询参数对象
    params: AssignListRequest;

    // 保存维修指派类型数据
    public maintenanceAssignTypes;

    // 保存维修技师列表数据  用于派工/转派
    public maintenanceTechnicians: SelectOption[];

    // 当前选择的工单记录   用于查看工单详情  执行作废等功能
    selectedOrder = null;

    // 当前登录用户信息
    public user = null;

    ngOnInit() {
        // 初始化维修指派类型数据
        this.service.getMaintenanceAssignTypes()
            .subscribe(data => {
                this.maintenanceAssignTypes = data;

                // 初始时 要加入所有的工单状态
                this.params.states = this.maintenanceAssignTypes.map(item => item.id);

                // 页面初始化的时候  就要加入状态参数
                super.ngOnInit();
            });

    }


    constructor(injector: Injector,
        protected service: AssignService,

        private fb: FormBuilder) {
        super(injector, service);
        this.params = new AssignListRequest();

        // 获取当前登录用户信息
        this.user = JSON.parse(sessionStorage.getItem(StorageKeys.Identity));
        console.log('当前登陆用户: ', this.user);

        // 创建表单
        this.createForm();

        // 初始化维修技师数据
        this.service.getMaintenanceTechnicians()
            .subscribe(data => {
                this.maintenanceTechnicians = data.map(item => {
                    return {
                        text: item.name,
                        value: item.id,
                        // selected: false
                    };
                });
            });
    }

    // 点击多选框处理程序
    onMultiSelectorClick(evt) {
        evt.preventDefault();
        this.resetMaintenanceTechnicians();
    }

    createForm() {
        this.assignOrderForm = this.fb.group({
            keyword: '', // 车牌号
        });
    }


    /**
   * 根据条件查询工单数据
   * @memberOf OrderListComponent
   */
    onSearch() {
        // 组织工单状态数据
        let checkedStatus = this.maintenanceAssignTypes.filter(item => item.checked);
        // 没选的话   查询所有
        if (checkedStatus.length === 0) {
            checkedStatus = this.maintenanceAssignTypes;
        }
        this.params.states = checkedStatus.map(item => item.id);

        console.log('当前选择的工单状态为：', JSON.stringify(this.params.states));

        // 执行查询
        this.onLoadList();
    }


    /**
     * 维修派工全选/反选事件处理程序
     * @param evt 
     */
    assignToggleCheckboxAll(cb) {
        console.log('维修派工切换全选复选框', cb.checked);
        // 更新全选复选框状态
        this.selectedOrder.serviceOutputs.checkedAll = cb.checked;
        // 更新维修工项复选框状态
        if (cb.checked) {
            this.selectedOrder.serviceOutputs.map(item => {
                // 如果没有转派  也就是复选框可用 设置为选中状态
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
        this.selectedOrder.serviceOutputs.enableAssignment = this.selectedOrder.serviceOutputs.filter(item => item.checked).length > 0;
    }

    /**
     * 复选框切换事件
     * @param record 
     */
    assignToggleCheckbox(record) {
        // 更新当前操作的维修工项复选框状态
        record.checked = !record.checked;

        // 更新全选复选框状态
        const tmp = this.selectedOrder.serviceOutputs;
        // 选中的维修项目
        const checked = tmp.filter(item => item.checked).length;
        // 转派过的维修项目
        const disabled = tmp.filter(item => item.teamType === '10').length;

        this.selectedOrder.serviceOutputs.checkedAll = (checked + disabled) === tmp.length;
        // 指派  转派按钮是否可用
        this.selectedOrder.serviceOutputs.enableAssignment = this.selectedOrder.serviceOutputs.filter(item => item.checked).length > 0;
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
            this.selectedOrder.serviceOutputs.enableAssignment = false;
            // 全选复选框是否选中标志
            this.selectedOrder.serviceOutputs.checkedAll = false;

            // 统计各项费用

            // 工时费： 维修项目金额总和
            this.selectedOrder.workHourFee = data.serviceOutputs.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.amount;
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
        });
    }

    /**
     * 点击完工按钮处理程序
     * @param evt 
     * @param id 
     */
    finishedOrder(evt, id, confirmModal) {
        evt.preventDefault();
        // 显示确认框
        confirmModal.show();

        // 记录id
        confirmModal.id = id;
    }

    /**
     * 点击完工按钮处理程序
     * 
     * @param {any} confirmModal 
     * 
     * @memberOf AssignOrderComponent
     */
    onConfirmFinished(confirmModal) {
        console.log('要确认完工的工单id为：', confirmModal.id);
        // 调用完工接口
        this.service.update({ id: confirmModal.id }).then(() => {
            // 完工操作成功提示
            this.alerter.success('执行完工操作成功！');

            this.onLoadList();
        });
        // 隐藏确认框
        confirmModal.hide();
    }

    /**
     * 指派或者转派处理程序
     * @param event 
     * @param id  工单id
     * @param id 派工类型 1.指派 2.更改 3.转派 默认1
     */
    assignOrderHandler(type) {
        // 获取选择的工项列表
        const maintenanceItemIds = this.selectedOrder.serviceOutputs.filter(item => item.checked).map(item => item.id);
        console.log('选择的维修工单为：', maintenanceItemIds);
        // 判断是否选择维修工项
        if (maintenanceItemIds.length === 0) {
            this.alerter.warn('请选择维修工项！');
            return;
        }

        // 获取选中的维修技师
        const employeeIds = this.maintenanceTechnicians.filter(item => item.selected).map(item => item.value);
        console.log('选择的维修技师为：', employeeIds);
        // 判断是否选择维修技师
        if (employeeIds.length === 0) {
            this.alerter.warn('请选择维修技师！');
            return;
        }
        // 执行 派工操作
        // this.service.assignOrder({
        //     maintenanceId: this.selectedOrder.id,
        //     type: type,
        //     employeeIds: employeeIds
        // }).then(() => {
        //     let msg = '';
        //     if (type === 1) {
        //         msg = '指派';
        //     } else if (type === 2) {
        //         msg = '转派';
        //     } else if (type === 3) {
        //         msg = '更改';
        //     }
        //     this.alerter.success('执行' + msg + '操作成功！');

        //     // 刷新页面
        //     this.onLoadList();
        // });
    }

    /**
     * 多选框选择更改事件处理程序
     * @param evt 
     */
    onChangeTechnicians(evt) {
        // console.log(evt);
        this.maintenanceTechnicians.map(item => {
            if (item.value === evt.value) {
                item.selected = evt.selected;
            }
        });
    }

    /**
     * 确认指派给哪些维修技师
     * 
     * @param {any} type   指派类型
     * 
     * @memberOf AssignOrderComponent
     */
    onConfirmTechnicians(type) {
        console.log('onConfirmTechnicians', this.selectedOrder.id);

        this.assignOrderHandler(type);
    }

    // 初始化维修技师数据
    resetMaintenanceTechnicians() {
        return this.maintenanceTechnicians.map(item => {
            if (item.selected) {
                item.selected = false;
            }
        });
    }
}
