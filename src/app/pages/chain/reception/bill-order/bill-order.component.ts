import { Component, OnInit, Injector, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, Validator } from '@angular/forms';
import { DataList, StorageKeys } from "app/shared/models";
import { BillOrderService, OrderListSearch } from "./bill-order.service";
import { Router } from "@angular/router";
import { HqAlerter } from "app/shared/directives";
import { PrintDirective, FormGroupControlErrorDirective } from 'app/shared/directives';
import { CustomValidators } from "ng2-validation/dist";
import { ChainService } from "app/pages/chain/chain.service";
import { DialogService } from "app/shared/services";
import { priceMask } from 'app/pages/chain/chain-shared';
import * as moment from 'moment';

@Component({
    selector: 'app-bill-order',
    templateUrl: './bill-order.component.html',
    styleUrls: ['./bill-order.component.css']
})

export class BillOrderComponent extends DataList<any>{
    priceMask = priceMask;
    [name: string]: any;
    private form: FormGroup;
    moneyObj: any;
    mileage: any;
    billPricex: any;
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
    @ViewChildren(FormGroupControlErrorDirective)
    private controls: QueryList<FormGroupControlErrorDirective>;
    params: OrderListSearch;
    materialFee = 0;
    workHourFee = 0;
    isShowCost = false;
    isShowCostDetail = false;
    isShowPrint = false;
    public user = null;

    // 结束时间参数对象
    endDateParams = {
        endtime: undefined,
    }
    private settlementid: any;
    constructor(
        private router: Router,
        injector: Injector,
        protected service: BillOrderService,
        protected typeservice: ChainService,
        protected dialogService: DialogService,
        private fb: FormBuilder) {
        super(injector, service);
        this.params = new OrderListSearch();
        this.endDateParams.endtime = this.params.endtime;
        // 状态
        this.service.getOrderStatus()
            .subscribe(data => {
                this.orderStatusData = data;
            });
        this.user = JSON.parse(sessionStorage.getItem(StorageKeys.Identity));
        this.reset();
        this.billForm();

        //结算方式类型
        this.typeservice.getSettlementType().then(data => {
            this.billTypeData = data;

        });
        this.initprint()
    }
    billSheetForm: FormGroup;
    billForm() {
        this.billSheetForm = this.fb.group({
            billPrice: ['', [Validators.required, CustomValidators.lte(this.billPricex / 100)]], //金额
            // leaveMileage: ['', [Validators.required, CustomValidators.gte(this.mileage)]], // 出厂里程
            settlementid: ['', [Validators.required]]
        })
    }
    // 点击查询
    onSearch() {
        // 组织工单状态数据
        const checkedStatus = this.orderStatusData.filter(item => {
            return item.checked;
        });
        this.params.statekey = checkedStatus.map(item => item.key);
        if (this.endDateParams.endtime)
            this.params.endtime = this.endDateParams.endtime + ':59.999';
        // 执行查询
        this.onLoadList();
    }
    // 点击结算事件
    productOutputs: any = [];
    attachServiceOutputs: any = [];
    suggestServiceOutputs: any = [];
    WorkReceivableCost: any;
    private modaltitle: string;
    orderDetailsDialog(evt, id, dialog, item) {
        this.modaltitle = "维修结算";
        item.generat = true;
        this.isShowCostDetail = false;
        this.isShowCost = true;
        this.isShowPrint = false;
        this.leaveMileage = "";
        evt.preventDefault();
        // 根据id获取工单详细信息
        this.service.get(id).then(data => {
            this.mileage = data.mileage;
            // 记录当前操作的工单记录
            this.selectedOrder = data;
            this.productOutputs = data.serviceOutputs;
            this.attachServiceOutputs = data.attachServiceOutputs;
            this.suggestServiceOutputs = data.suggestServiceOutputs;
            this.billId = this.selectedOrder["id"];
        }).then(() => {
            this.service.getCost(id).then(data => {
                // 打折之前的工时费
                this.workReceivableCost = data.workReceivableCost;
                // 工时费： 维修项目打折之后
                this.workHourFee = data.workHourCost;
                // 材料费： 维修配件金额总和
                this.materialFee = data.materialCost;
                if (data.deduceAmount) {
                    this.discountAmount = data.deduceAmount + (data.workReceivableCost - data.workHourCost);
                } else {
                    this.discountAmount = data.workReceivableCost - data.workHourCost;
                }
                // 其它费： 0
                this.otherFee = 0;
                // 总计费： 
                this.sumFee = data.amount;
                this.billPricex = (+this.sumFee);
                item.generat = false;
                this.billForm();
                // this.billSheetForm.controls.leaveMileage.setValue(this.mileage);
                this.billSheetForm.controls.billPrice.setValue((+this.sumFee / 100));
                this.billSheetForm.controls.settlementid.setValue(this.billTypeData[0].id);
                // 显示窗口
                dialog.show();
            });
        }).catch(err => {
            this.alerter.error(err, true, 3000);
            item.generat = false;
        });
    }
    // 点击撤销结算事件
    finishedOrder(evt, id) {
        evt.preventDefault();
        this.dialogService.confirm({
            type: "warning",
            text: '确定要撤销结算吗？'
        }, () => {
            this.service.put(id).then(() => {
                this.alerter.info('撤销结算成功!', true, 3000);
                this.onLoadList()
            }).catch(err => this.alerter.error(err, true, 3000));
        })

    }

    hideModal(lgModal) {
        lgModal.hide();
        this.isShowPrint = false;
        this.initprint()
    }

    amountStatus: string;
    private printData: any;
    initprint() {
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
    deduceAmount: any;
    // 点击详情事件
    DetailsDialog(evt, id, dialog, item) {
        this.initprint();
        this.modaltitle = "维修结算详情";
        item.generating = true;
        this.isShowCost = false;
        this.isShowCostDetail = true;
        this.workHourFee = 0;
        this.materialFee = 0;
        this.otherFee = 0;
        this.sumFee = 0;
        evt.preventDefault();
        // 根据id获取工单详细信息
        this.service.get(id).then(data => {
            // 记录当前操作的工单记录
            this.selectedOrder = data;
            this.billId = this.selectedOrder["id"]
        }).then(() => {
            this.service.getCost(id).then(data => {
                if (!data.isSettlement) {
                    this.isShowPrint = false;
                } else {
                    this.service.getPrintDetail(id)
                        .then(data => {
                            Object.assign(this.selectedOrder, data);
                            this.printData.maindata = data;
                            this.printData.costData = data.totalCost; //收费结算单
                            this.printData.workHourData = data.workHours;//工时明细
                            this.printData.materialData = data.matereialDetails; //材料明细
                            this.printData.appendItems = data.appendItems;
                            this.printData.adviceItems = data.adviceItems;
                            // 工时明细
                            this.printData.workHourData.forEach(item => {
                                //金额
                                this.printData.moneyObj.workItemMoney += item.amount;
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
                                // this.printData.moneyObj.costCountMoney += (item.receivableCost - item.discountCost);
                            });
                            this.printData.moneyObj.costCountMoney = this.printData.moneyObj.discountMoney;
                            if (data.deduceAmount) {
                                this.printData.moneyObj.costCountMoney += data.deduceAmount;
                            }
                            this.isShowPrint = true;
                            item.generating = false;
                            // 显示窗口
                            dialog.show();

                        })
                        .catch(err => {
                            // 获取工单信息失败
                            this.alerter.error(err, true, 2000);
                            item.generating = false;
                        });
                }
                this.workReceivableCost = data.workReceivableCost;
                // 工时费： 维修项目打折之后
                this.workHourFee = data.workHourCost;
                // 材料费： 维修配件金额总和
                this.materialFee = data.materialCost;
                if (data.deduceAmount) {
                    this.discountAmount = data.deduceAmount + (data.workReceivableCost - data.workHourCost);
                } else {
                    this.discountAmount = data.workReceivableCost - data.workHourCost;
                }

                // 总计费： 
                this.sumFee = data.amount;
                // this.billPrice = this.sumFee;
                item.generating = false;
                // 显示窗口
                dialog.show();
            })
        }).catch(err => { this.alerter.error(err, true, 3000); item.generating = false })

    }
    private billData = {};
    generat = false;
    private leaveMileage: any;
    // 点击确定生成结算
    BillClick(evt, dialog) {
        evt.preventDefault();
        // this.billData["id"] = this.billId;
        this.billData["price"] = parseInt((this.billSheetForm.controls.billPrice.value * 100).toFixed(2));
        // this.billData["leaveMileage"] = this.billSheetForm.controls.leaveMileage.value + "";
        this.billData["settlementMethodId"] = this.billSheetForm.controls.settlementid.value;
        let invalid = this.controls
            .map(c => c.validate())
            .some(m => !m);
        if (invalid) {
            event.preventDefault();
            return false;
        } else {
            this.dialogService.confirm({
                type: "question",
                text: '是否生成维修结算单？'
            }, () => {
                this.initprint();
                this.generat = true;
                this.service.post(this.billData, this.billId).then((result) => {
                    this.generat = false;
                    this.dialogService.confirm({
                        type: "question",
                        text: '已生成维修结算单，是否需要打印？'
                    }, () => {
                        // 根据id获取工单详细信息
                        this.service.getPrintDetail(this.billId)
                            .then(data => {
                                this.printData.maindata = data;
                                this.printData.costData = data.totalCost; //收费结算单
                                this.printData.workHourData = data.workHours;//工时明细
                                this.printData.materialData = data.matereialDetails; //材料明细
                                this.printData.appendItems = data.appendItems;
                                this.printData.adviceItems = data.adviceItems;
                                // 工时明细
                                this.printData.workHourData.forEach(item => {
                                    //金额
                                    this.printData.moneyObj.workItemMoney += item.amount;
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
                                    // this.printData.moneyObj.costCountMoney += (item.receivableCost - item.discountCost);
                                });

                                this.printData.moneyObj.costCountMoney = this.printData.moneyObj.discountMoney;
                                if (data.deduceAmount) {
                                    this.printData.moneyObj.costCountMoney += data.deduceAmount;
                                }
                                setTimeout(() => this.print(dialog), 1000)
                            })
                            .catch(err => {
                                this.alerter.error(err, true, 2000);
                                this.generat = false;
                            });
                    })
                    dialog.hide();
                    this.alerter.info("生成结算单成功", true, 2000);
                    this.onLoadList();
                    this.isShowCost = false;
                }).catch(err => { dialog.hide(), this.generat = false; this.alerter.error(err, true, 3000) });
            })

        }

    }
    // 点击打印事件
    private pathname;
    print(dialog) {
        this.printer.print();
        // dialog.hide();
        // setTimeout(function() {
        //     this.initprint()
        // }, 3000); 
    }
    // 重置为初始查询条件
    reset() {
        this.statekey = [];
    }

    public get maxStartTime() {
        return !!this.endDateParams.endtime ? this.endDateParams.endtime : moment().toDate()
    }
    public get maxEndTime() {
        return moment().toDate();
    }

    public get minEndTime() {
        if (this.params.starttime) {
            return moment(this.params.starttime).subtract(1, 'd').toDate();
        }
        return '';
    }
}
