import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataList, StorageKeys } from "app/shared/models";
import { Router } from "@angular/router";
import { OrderListSearch, CheckOutService } from "./checkout.service";
import { HqAlerter } from "app/shared/directives";
import * as moment from 'moment';

@Component({
  selector: 'hq-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent extends DataList<any> {
  costMoney: any;
  payCheckSingle: any;
  payData: any;
  sumFee: number;
  otherFee: number;
  billId: any;
  statekey: any[];
  orderStatusData: any;
  selectedOrder: any;
  CheckoutForm: FormGroup;
  params: OrderListSearch;
  materialFee = 0;
  workHourFee = 0;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  public user = null;

  // 结束时间参数对象
  endDateParams = {
    endtime: undefined,
  }

  constructor(
    private router: Router,
    injector: Injector,
    protected service: CheckOutService,
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
    // 构建表单
    this.createForm();
    this.service.getPayType().then(data => {
      this.payData = data;
    })
  }

  // 点击查询
  onSearch() {
    // 组织工单状态数据
    this.params.statekey = this.orderStatusData.filter(item => item.checked).map(item => item.key);
    if (this.endDateParams.endtime)
      this.params.endtime = this.endDateParams.endtime + ':59.999';
    // 执行查询
    this.onLoadList();
  }
  deduceAmount: any;
  // 点击详情事件
  DetailsDialog(evt, item, id, dialog) {
    item.generating = true;
    evt.preventDefault();

    // 根据id获取工单详细信息
    // this.service.get(id).then(data => {
    //   // 记录当前操作的工单记录
    //   this.selectedOrder = data;
    //   this.billId = this.selectedOrder["id"];
    // });

    this.service.getPrintDetail(id)
      .then(data => {
        this.selectedOrder = data;
        this.billId = this.selectedOrder["id"];
        // Object.assign(this.selectedOrder, data);
        // this.selectedOrder.updateUser = data.updateUser;//结算人
        // this.selectedOrder.updateOnUtc = data.updateOnUtc;//结算时间
        // this.selectedOrder.settlementParty = data.settlementParty;//结算方
        // this.selectedOrder.settlementCode = data.settlementCode;//结算单号
        // this.selectedOrder.leaveMileage = data.leaveMileage;//出厂里程
        if (item.updateOnUtc) {
          this.selectedOrder.updataTime = item.updateOnUtc;//出厂时间
        }
        item.generating = false;
        // 显示窗口
        setTimeout(() => dialog.show(), 200);
      })
      .catch(err => { this.alerter.error(err, true, 2000); item.generating = false; });

    // 根据工单id获取工单材料费和工时费
    this.service.getCost(id).then(data => {
      // 工时费： 维修项目金额总和
      this.workHourFee = data.workReceivableCost;
      // 材料费： 维修配件金额总和
      this.materialFee = data.materialCost;
      // 其它费： 0
      this.otherFee = 0;
      // 总计费： 
      this.sumFee = data.workHourCost + data.materialCost + this.otherFee;

      this.billPrice = data.amount;

      if (data.deduceAmount) {
        this.deduceAmount = data.deduceAmount + data.workReceivableCost - data.workHourCost;
      } else {
        this.deduceAmount = data.workReceivableCost - data.workHourCost
      }
    })
  }
  private billData = {};
  private billPrice;
  // 点击收银显示弹框
  OnCheckout(evt, amount, id, dialog) {
    evt.preventDefault();
    // 显示窗口
    this.payData.map(item => item.amount = "");
    dialog.show();
    this.billId = id;
    this.costMoney = amount;
  }
  //确定收银接口
  private payPost = [];
  OnPostPay(dialog) {
    let cost: any = 0;
    if (this.costMoney > 0) {
      this.payCheckSingle = this.payData.filter(item => item.amount || item.amount === '').map(item => {
        let paycheck: any = {};
        paycheck.paymentMethod = item.id;
        cost += Number(item.amount * 100);
        paycheck.amount = Number(item.amount * 100).toFixed(0);
        return paycheck;
      })
      this.payPost = this.payCheckSingle.filter(item => item.amount != 0);
    } else {
      this.payPost = this.payData.filter(item => item.amount === 0).map(item => {
        let paycheck: any = {};
        paycheck.paymentMethod = item.id;
        paycheck.amount = Number(item.amount * 100).toFixed(0);
        return paycheck;
      });
      this.payCheckSingle = this.payData.filter(item => item.amount || item.amount === '').map(item => {
        cost += Number(item.amount * 100);
      })
    }    
    cost=cost.toFixed(0);
    if (cost != this.costMoney) {
      this.alerter.error('输入金额与应收金额不符，请重新填写！', true, 3000);
    } else {
      this.service.postPay(this.payPost, this.billId).then(() => {
        this.alerter.info('收银成功!', true, 2000).onClose(() => { dialog.hide(); this.onLoadList(); });
        this.payCheckSingle = [];
        this.payPost = [];
      }).catch(err => this.alerter.error(err, true, 2000));
    }
  }
  createForm() {
    // 初始化数组类型参数
    this.statekey = []
    this.CheckoutForm = this.fb.group({
      carnumber: '', // 车牌号
      billcode: '',//工单号
      SettlementCode: '',
      starttime: '',
      endtime: '',
    });
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
