import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataList, StorageKeys } from "app/shared/models";
import { BillOrderService, OrderListSearch } from "./bill-order.service";
import { Router } from "@angular/router";
import { HqAlerter } from "app/shared/directives";

@Component({
    selector: 'app-bill-order',
    templateUrl: './bill-order.component.html',
    styleUrls: ['./bill-order.component.css']
})

export class BillOrderComponent extends DataList<any>{

    sumFee: number;
    otherFee: number;
    billId: any;
    statekey: any[];
    orderStatusData: any;
    selectedOrder = null;
    workSheetSearchForm: FormGroup;
    @ViewChild(HqAlerter)
    protected alerter: HqAlerter;
    params: OrderListSearch;
    materialFee = 0;
    workHourFee = 0;
    isShowCost = false;
    isShowCostDetail = false;
    isShowPrint = false;
    public user = null;
    constructor(
        private router: Router,
        injector: Injector,
        protected service: BillOrderService,
        private fb: FormBuilder) {
        super(injector, service);
        this.params = new OrderListSearch();
        // 状态
        this.service.getOrderStatus()
            .subscribe(data => {
                this.orderStatusData = data;
            });
        this.user = JSON.parse(sessionStorage.getItem(StorageKeys.Identity));
        // 构建表单
        this.createForm();
    }

    // 点击查询
    onSearch() {
        // 组织工单状态数据
        const checkedStatus = this.orderStatusData.filter(item => {
            return item.checked;
        });
        this.params.statekey = checkedStatus.map(item => item.key);

        // this.params.endtime += " 23:59:59";
        // 执行查询
        this.onLoadList();
    }
    // 点击结算事件
    orderDetailsDialog(evt, id, dialog, item) {
        console.log(item)
        this.isShowCostDetail = false;
        this.isShowCost = true;
        this.isShowPrint = false;
        this.leaveMileage = "";
        evt.preventDefault();
        // 显示窗口
        dialog.show();
        // 根据id获取工单详细信息
        this.service.get(id).then(data => {
            console.log('根据工单id获取工单详情数据：', data);

            // 记录当前操作的工单记录
            this.selectedOrder = data;
            this.billId = this.selectedOrder["id"]

        });
        this.service.getCost(id).then(data => {
            console.log("根据工单id获取工单材料费和工时费", data);
            // 工时费： 维修项目金额总和
            this.workHourFee = data.workHourCost;
            // 材料费： 维修配件金额总和
            this.materialFee = data.materialCost;
            // 其它费： 0
            this.otherFee = 0;
            // 总计费： 
            this.sumFee = data.amount;
            this.billPrice = (Number(this.sumFee) / 100).toFixed(2);
            // this.billPrice = this.sumFee;           
        })

    }
    // 点击撤销结算事件
    finishedOrder(evt, id, confirmModal) {
        evt.preventDefault();
        // 显示确认框
        confirmModal.show();

        // 记录id
        confirmModal.id = id;
    }
    unBill(confirmModal) {
        confirmModal.hide();
        console.log(confirmModal.id)
        this.service.put(confirmModal.id).then(() => {
            this.alerter.info('撤销结算成功!', true, 3000);
            this.onLoadList()
        }).catch(err => console.log("撤销结算失败" + err));

    }
    private billPrice: any;
    // 点击详情事件
    DetailsDialog(evt, id, dialog) {
        this.isShowCost = false;
        this.isShowCostDetail = true;
        evt.preventDefault();
        // 显示窗口
        dialog.show();
        // 根据id获取工单详细信息
        this.service.get(id).then(data => {
            console.log('根据工单id获取工单详情数据：', data);

            // 记录当前操作的工单记录
            this.selectedOrder = data;
            this.billId = this.selectedOrder["id"]

        });
        this.service.getCost(id).then(data => {
            if (!data.isSettlement) {
                this.isShowPrint = false;
            } else {
                this.isShowPrint = true;
            }
            console.log("根据工单id获取工单材料费和工时费", data);
            // 工时费： 维修项目金额总和
            this.workHourFee = data.workHourCost;
            // 材料费： 维修配件金额总和
            this.materialFee = data.materialCost;
            // 其它费： 0
            this.otherFee = 0;
            // 总计费： 
            this.sumFee = data.amount;

            // this.billPrice = this.sumFee;
        })
    }
    private billData = {};

    private leaveMileage = "";
    // 点击确定生成结算单
    BillClick(evt, dialog) {

        evt.preventDefault();

        // this.billData["id"] = this.billId;
        this.billData["price"] = this.billPrice * 100;
        this.billData["leaveMileage"] = this.leaveMileage;
        this.billData=JSON.stringify(this.billData);
        console.log(this.billData)
        if (this.leaveMileage.length === 0) {
            this.alerter.error("出厂里程不能为空", true, 3000);
            return false;
        } else {
            this.service.post(this.billData, this.billId).then((result) => {
                this.alerter.info("生成结算单成功", true, 3000);
                this.isShowCost = false;
                setTimeout(dialog.hide(), 6000);
                this.onLoadList();
            }).catch(err => this.alerter.error(err, true, 3000));
        }

    }
    // 点击打印事件
    private pathname;
    OnPrintClick() {
        this.router.navigate(['/chain/reception/bill/print', this.billId])
    }
    createForm() {
        // 初始化数组类型参数
        this.statekey = []
        this.workSheetSearchForm = this.fb.group({
            carnumber: '', // 车牌号
            billcode: '',//工单号
            starttime: '',
            endtime: '',
        });
    }
}
