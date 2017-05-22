import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataList, StorageKeys } from "app/shared/models";
import { BillOrderService, OrderListSearch } from "./bill-order.service";
import { Router } from "@angular/router";
import { HqAlerter } from "app/shared/directives";
import { PrintDirective } from 'app/shared/directives';

@Component({
    selector: 'app-bill-order',
    templateUrl: './bill-order.component.html',
    styleUrls: ['./bill-order.component.css']
})

export class BillOrderComponent extends DataList<any>{

    moneyObj: any;

    mileage: any;

    costCountMoney: number;
    workCostMoney: number;
    AmaterialMoney: number;
    discountMoney: any;
    costMoney: number;
    sumFee: number;
    otherFee: number;
    billId: any;
    statekey: any[];
    orderStatusData: any;
    selectedOrder: any;
    workSheetSearchForm: FormGroup;
    @ViewChild(HqAlerter)
    protected alerter: HqAlerter;
    @ViewChild('printer')
    public printer: PrintDirective;
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
    productOutputs: any = [];
    attachServiceOutputs: any = [];
    suggestServiceOutputs: any = [];
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
            this.leaveMileage = data.mileage;
            this.mileage = data.mileage;
            // 记录当前操作的工单记录
            this.selectedOrder = data;
            this.productOutputs = data.serviceOutputs;
            this.attachServiceOutputs = data.attachServiceOutputs;
            this.suggestServiceOutputs = data.suggestServiceOutputs;
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
    ngAfterViewChecked() {
        if (this.isShowPrint) {
            this.printData = {
                maindata: {},
                costData: [],
                workHourData: [],
                materialData: [],
                appendItems: [],
                adviceItems: [],
                moneyObj: {
                    workCostMoney: 0,
                    discountMoney: 0,
                    materialMoney: 0,
                    costMoney: 0,
                    costCountMoney: 0,
                    workItemMoney: 0
                }
            }
        }
    }
    hideModal(lgModal) {
        lgModal.hide();
        this.isShowPrint = false;
        this.printData = {
            maindata: {},
            costData: [],
            workHourData: [],
            materialData: [],
            appendItems: [],
            adviceItems: [],
            moneyObj: {
                workCostMoney: 0,
                discountMoney: 0,
                materialMoney: 0,
                costMoney: 0,
                costCountMoney: 0,
                workItemMoney: 0
            }
        }
    }
    private billPrice: any;

    amountStatus: string;
    private printData = {
        maindata: {},
        costData: [],
        workHourData: [],
        materialData: [],
        appendItems: [],
        adviceItems: [],
        moneyObj: {
            workCostMoney: 0,
            discountMoney: 0,
            materialMoney: 0,
            costMoney: 0,
            costCountMoney: 0,
            workItemMoney: 0
        }
    }
    // 点击详情事件
    DetailsDialog(evt, id, dialog, item) {
        item.generating = true;
        console.log(item);
        if (item.updateOnUtc) {
            this.amountStatus = "实收金额"
        } else {
            this.amountStatus = "应收金额"
        }
        this.isShowCost = false;
        this.isShowCostDetail = true;
        this.workHourFee = 0;
        this.materialFee = 0;
        this.otherFee = 0;
        this.sumFee = 0;
        evt.preventDefault();

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
                this.service.getPrintDetail(id)
                    .then(data => {
                        console.log('结算单', data)
                        this.selectedOrder.updateUser = data.updateUser;//结算人
                        this.selectedOrder.updateOnUtc = data.updateOnUtc;//结算时间
                        this.selectedOrder.settlementParty = data.settlementParty;//结算方
                        this.selectedOrder.settlementCode = data.settlementCode;//结算单号
                        this.selectedOrder.leaveMileage = data.leaveMileage;//出厂里程
                        this.printData.maindata = data;
                        this.printData.costData = data.totalCost; //收费结算单
                        this.printData.workHourData = data.workHours;//工时明细
                        this.printData.materialData = data.matereialDetails; //材料明细
                        this.printData.appendItems = data.appendItems;
                        this.printData.adviceItems = data.adviceItems;
                        // 工时明细
                        this.printData.workHourData.forEach(item => {
                            //金额
                            this.printData.moneyObj.workItemMoney = item.amount * item.discount
                            // 工时明细的应收金额和折扣金额
                            this.printData.moneyObj.workCostMoney += item.discountCost;
                            this.printData.moneyObj.discountMoney += item.amount * (1 - item.discount / 100);
                        });
                        // 材料明细
                        this.printData.materialData.forEach(item => {
                            // 材料明细的应收金额
                            this.printData.moneyObj.materialMoney += item.amount;
                        })
                        // 收费结算单金额
                        this.printData.costData.forEach(item => {
                            this.printData.moneyObj.costMoney += item.receivableCost;
                            this.printData.moneyObj.costCountMoney += (item.receivableCost - item.discountCost);
                        });
                        console.log(this.printData)
                        this.isShowPrint = true;
                        item.generating = false;
                        // 显示窗口
                        dialog.show();
                    })
                    .catch(err => {
                        this.alerter.error('获取工单信息失败: ' + err, true, 2000);
                        item.generating = false;
                    });


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
            item.generating = false;
            // 显示窗口
            dialog.show();

        })


    }
    private billData = {};

    private leaveMileage: any;
    // 点击确定生成结算
    BillClick(evt, dialog) {
        evt.preventDefault();

        // this.billData["id"] = this.billId;
        this.billData["price"] = this.billPrice * 100;
        this.billData["leaveMileage"] = this.leaveMileage + "";
        console.log(this.billData)
        if (this.leaveMileage.length === 0) {
            this.alerter.error("出厂里程不能为空", true, 3000);
            return false;
        } else if (this.leaveMileage < this.mileage) {
            this.alerter.error("出厂里程不能小于进店里程", true, 3000);
            return false;
        } else {
            this.service.post(this.billData, this.billId).then((result) => {
                console.log(result)
                if (confirm('生成结算单成功！ 是否打印？')) {
                    setTimeout(() => {
                        this.print();
                        // 清空数据

                    }, 200);
                } else {
                    // 清空数据

                }
                this.alerter.info("生成结算单成功", true, 3000).onClose(() => dialog.hide());
                this.isShowCost = false;
                this.onLoadList();
            }).catch(err => this.alerter.error(err, true, 3000));
        }

    }
    // 点击打印事件
    private pathname;


    print() {
        this.printer.print();
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
