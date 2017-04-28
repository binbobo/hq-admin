import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { DataList } from '../../../shared/models/data-list';
import { AssignService, AssignListRequest } from '../assign.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StorageKeys, SelectOption } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';


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
        // 调用完工接口
        this.service.update({ id: confirmModal.id }).then(() => {
            // 完工操作成功提示
            this.alerter.success('执行完工操作成功！')
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
    assignOrderHandler(id, type) {
        // 获取选中的维修技师
        const employeeIds = this.maintenanceTechnicians.filter(item => item.selected).map(item => item.value);
        console.log('选择的维修技师为：', employeeIds);

        if (employeeIds.length === 0) {
            this.alerter.warn('请选择维修技师！');
            return;
        }
        // 执行 派工操作
        this.service.assignOrder({
            maintenanceId: id,
            type: type,
            employeeIds: employeeIds
        }).then(() => {
            let msg = '';
            if (type === 1) {
                msg = '指派';
            } else if (type === 2) {
                msg = '指派';
            } else if (type === 3) {
                msg = '更改';
            }
            this.alerter.success(msg);
        });

        // 刷新页面
        this.onLoadList();
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
     * @param {any} id   工单id
     * 
     * @memberOf AssignOrderComponent
     */
    onConfirmTechnicians(id, type) {
        console.log('onConfirmTechnicians', id);

        this.assignOrderHandler(id, type);
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
