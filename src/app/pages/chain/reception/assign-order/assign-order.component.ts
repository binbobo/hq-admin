import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { AssignService, AssignListRequest } from '../assign.service';
import { StorageKeys, SelectOption, DataList } from 'app/shared/models';
import * as fileSaver from 'file-saver';
import { ModalDirective } from 'ngx-bootstrap';
import { SweetAlertService } from '../../../../shared/services/sweetalert.service';


@Component({
    selector: 'app-assign-order',
    templateUrl: './assign-order.component.html',
    styleUrls: ['./assign-order.component.css'],
})

export class AssignOrderComponent extends DataList<any> implements OnInit {
    // 查询参数对象
    params: AssignListRequest;

    // 保存维修指派类型数据
    public maintenanceAssignTypes;

    // 保存维修技师列表数据  用于派工/转派
    public maintenanceTechnicians: SelectOption[];
    // 保存当前选择的维修技师列表
    selectedTechnicians = [];

    // 当前选择的工单记录   用于查看工单详情  执行作废等功能
    selectedOrder = null;
    isDetailModalShown = false; // 详情弹框是否可见
    statistics: any = null; // 各种状态数量统计
    @ViewChild('assignModal')
    assignModal: ModalDirective;

    generating = {
        assign: false,
        reassign: false
    };

    ngOnInit() {
        // 解决缓存问题
        this.lazyLoad = true;
        super.ngOnInit();
        // 初始化维修指派类型数据
        this.service.getMaintenanceAssignTypes()
            .subscribe(data => {
                this.maintenanceAssignTypes = [{
                    id: 'all',
                    value: '全部'
                }].concat(data);

                // 页面初始化的时候  就要加入状态参数
                this.params.status = this.maintenanceAssignTypes
                    .filter(item => item.id !== 'all')
                    .map(item => item.id);
                // 加载列表
                this.load();
            });
    }
    constructor(injector: Injector,
        protected sweetAlertService: SweetAlertService,
        protected service: AssignService) {
        super(injector, service);
        this.params = new AssignListRequest();

        // 初始化维修技师数据
        this.service.getMaintenanceTechnicians().subscribe(data => {
            this.maintenanceTechnicians = data.map(item => {
                return {
                    text: item.name,
                    value: item.id,
                    // checked: false  // 默认都不选中
                };
            });
        });
    }

    // 点击多选框处理程序
    onMultiSelectorClick(evt) {
        evt.preventDefault();
        // 设置全选复选框不可用
        this.selectedOrder.serviceOutputs.checkedAll = false;
        // 初始化当前选择的维修技师列表
        this.selectedTechnicians = [];
        // 重置维修项目选择弹框复选框的选中状态
        this.maintenanceTechnicians = this.maintenanceTechnicians.map(item => {
            item.checked = false;
            return item;
        });
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


    /**
    * 根据条件查询工单数据
    * @memberOf OrderListComponent
    */
    onSearch(evt?: any) {
        this.params.status = evt.chechedStatusIds;
        this.params.keyword = evt.keyword;
        // 执行查询
        this.load();
    }
    /**
   * 维修派工全选/反选事件处理程序
   * @param evt 
   */
    toggleCheckboxAll(cb) {
        // 更新全选复选框状态
        this.selectedOrder.serviceOutputs.checkedAll = cb.checked;
        // 更新维修工项复选框状态
        if (cb.checked) {
            this.selectedOrder.serviceOutputs.map(item => {
                // 如果没有转派过或者没有完工  也就是复选框可用 设置为选中状态
                if (item.teamType !== 4 && item.teamType !== 5) {
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
        this.selectedOrder.serviceOutputs.enableBtn = this.selectedOrder.serviceOutputs.filter(item => item.checked).length > 0;
    }

    /**
     * 复选框切换事件
     * @param record 
     */
    toggleCheckbox(record) {
        if (record.teamType === 4 || record.teamType === 5) {
            // 已转派或者已完工的不可以再操作
            return false;
        }
        // 更新当前操作的维修工项复选框状态
        record.checked = !record.checked;

        // 更新全选复选框状态
        const tmp = this.selectedOrder.serviceOutputs;
        // 选中的维修项目
        const checked = tmp.filter(item => item.checked).length;
        // 转派过的维修项目
        const disabled = tmp.filter(item => item.teamType === 4).length;

        this.selectedOrder.serviceOutputs.checkedAll = (checked + disabled) === tmp.length;
        // 指派  转派按钮是否可用
        this.selectedOrder.serviceOutputs.enableBtn = this.selectedOrder.serviceOutputs.filter(item => item.checked).length > 0;
    }

    /**
    * 点击工单详情按钮处理程序
    * @param {any} item
    * 
    * @memberOf OrderListComponent
    */
    orderDetailsHandler(item) {
        item.assignGenerating = true;

        // 根据id获取工单详细信息
        this.service.get(item.id).then(data => {
            // 记录当前操作的工单记录
            this.selectedOrder = data;
            // 指派按钮是否可用标志
            this.selectedOrder.serviceOutputs.enableBtn = false;
            // 全选复选框是否选中标志
            this.selectedOrder.serviceOutputs.checkedAll = false;

            item.assignGenerating = false;
            // 显示窗口
            this.assignModal.show();
            this.isDetailModalShown = true;
        }).catch(err => {
            this.alerter.error('获取工单信息失败: ' + err, true, 2000);
            item.assignGenerating = false;
        });
    }

    /**
     * 点击完工按钮处理程序
     * @param evt 
     * @param item
     */
    finishedOrder(item) {
        // 判断是否已经指派维修技师 没有指派不可以完工
        if (item.teamType === 0) {
            this.sweetAlertService.alert({
                text: '此工单还没有指派维修技师, 不可以执行完工操作。请先指派维修技师',
            }).then(() => {
            });
            return;
        }
        // // 判断用户是否领料
        // if (!item.productOutputs || item.productOutputs.length === 0) {
        //     if (confirm('用户' + item.createdUserName + '工项没有发料，是否确认完工？')) {
        //         // 调用完工接口
        //         this.confirmOrderFinish(item);
        //     }
        // } else {
        //     // 调用完工接口
        //     this.confirmOrderFinish(item);
        // }
        this.confirmOrderFinish(item);
    }

    confirmOrderFinish(item) {
        this.sweetAlertService.confirm({
            text: '您确定要完工吗？'
        }).then(() => {
            item.finishGenerating = true;

            this.service.update({ id: item.id }).then(() => {
                item.finishGenerating = false;
                this.load();
            }).catch(err => {
                this.alerter.error('执行完工操作失败: ' + err, true, 2000);
                item.finishGenerating = false;
            });
        }, () => {
            // 点击了取消
        });
    }

    /**
     * 指派或者转派处理程序
     * @param event 
     * @param type  
     */
    assignOrderHandler(type) {
        // 获取选择的工项列表
        const maintenanceItems = this.selectedOrder.serviceOutputs.filter(item => item.checked);
        // 提示消息
        let msg = '';
        // 执行指派操作时候  判断是否有已开工的工项
        if (type === 1) {
            msg = '指派';
            // teamType (integer, optional): 工项状态 1.待派工 2.待开工 3.已开工 4.已转派 5.已完工 = ['1', '2', '3', '4', '5'],
            let started = [];
            maintenanceItems.filter((item, index) => {
                if (item.teamType === 3) {
                    started.push(item);
                    // 过滤掉已开工的工项
                    maintenanceItems.splice(index, 1);
                }
            });
            // 判断是否有已开工的工项  如果有给出提示
            if (started.length > 0) {
                started = started.map(item => item.serviceName);
                // 给出提示
                this.alerter.error(started.join(',') + ' 已开工, 不可以再指派， 只能转派', true, 3000);
            }
        } else if (type === 2) {
            msg = '转派';
            // 执行转派操作时候  判断是否有未指派的工项
            let notAssigned = [];
            maintenanceItems.filter((item, index) => {
                if (item.teamType === 1) {
                    notAssigned.push(item);
                    // 过滤掉未指派的工项
                    maintenanceItems.splice(index, 1);
                }
            });
            // 判断是否有未指派的工项  如果有给出提示
            if (notAssigned.length > 0) {
                notAssigned = notAssigned.map(item => item.serviceName);
                // 给出提示
                this.alerter.error(notAssigned.join(',') + ' 未指派, 不可以转派,  请先指派', true, 3000);
            }
        }
        // 获取过滤之后的工项id列表
        const maintenanceItemIds = maintenanceItems.map(item => item.id);
        // 判断工项id列表是否为空
        if (maintenanceItemIds.length === 0) {
            this.generatingReset(type);
            return;
        }
        // 获取选中的维修技师id列表
        const employeeIds = this.selectedTechnicians;
        // 判断选中的维修技师id列表是否为空
        if (employeeIds.length === 0) {
            this.alerter.error('您还未选择维修技师,请先选择维修技师！', true, 3000);
            this.generatingReset(type);
            return;
        }

        // 执行 派工/转派 操作 根据type区分
        this.service.assignOrder({
            type: type,
            employeeIds: employeeIds,
            maintenanceItemIds: maintenanceItemIds
        }).then(data => {
            this.generatingReset(type);
            // forEach不可修改list数据, 只能遍历
            data.forEach(ele => {
                const index = this.selectedOrder.serviceOutputs.findIndex(m => m.id === ele.id);
                if (index > -1) {
                    this.selectedOrder.serviceOutputs.splice(index, 1, ele);
                }
            });

            this.alerter.success('执行' + msg + '操作成功！');
            // 设置派工按钮不可用
            this.selectedOrder.serviceOutputs.enableBtn = false;

            // 判断是否所有工项已派工  如果是, 关闭弹框
            if (this.selectedOrder.serviceOutputs.filter(m => m.teamType === 1).length <= 0) {
                this.assignModal.hide();
            }
            // 刷新页面
            this.load();
        }).catch(err => {
            this.alerter.error(err, true, 3000);
            this.generatingReset(type);
        });
    }
    // 派工按钮动画重置
    private generatingReset(type) {
        if (type === 1) {
            this.generating.assign = false;
        } else if (type === 2) {
            this.generating.reassign = false;
        }
    }

    /**
     * 确认指派给哪些维修技师
     * 
     * @param {any} type   type (integer, optional): 派工类型 1.指派 2.转派 默认1.指派 = ['1', '2']
     * 
     * @memberOf AssignOrderComponent
     */
    onConfirmTechnicians(evt, type) {
        this.selectedTechnicians = evt.value;
        if (type === 1) {
            this.generating.assign = true;
        } else if (type === 2) {
            this.generating.reassign = true;
        }
        this.assignOrderHandler(type);
    }
}
