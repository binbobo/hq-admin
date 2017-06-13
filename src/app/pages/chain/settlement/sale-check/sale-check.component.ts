import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataList, StorageKeys } from "app/shared/models";
import { Router } from "@angular/router";
import { OrderListSearch, SaleCheckService } from "./sale-check.service";
import { ChainService } from "app/pages/chain/chain.service";
import { HqAlerter } from "app/shared/directives";
import * as moment from 'moment';
import { priceMask} from 'app/pages/chain/chain-shared';

@Component({
  selector: 'hq-sale-check',
  templateUrl: './sale-check.component.html',
  styleUrls: ['./sale-check.component.css']
})
export class SaleCheckComponent extends DataList<any>  {
  priceMask = priceMask;
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
  private billTypeData: any;
  // 结束时间参数对象
  endDateParams = {
    endtime: undefined,
  }

  constructor(
    private router: Router,
    injector: Injector,
    protected service: SaleCheckService,
    protected typeservice: ChainService,
    private fb: FormBuilder) {
    super(injector, service);
    this.params = new OrderListSearch();
    this.endDateParams.endtime = this.params.endtime;
    // 状态
    this.service.getOrderStatus()
      .subscribe(data => {
        this.orderStatusData = data;
      });
    //结算方式类型
    this.typeservice.getSettlementType().then(data => {
      this.billTypeData = data;
      this.billTypeData.unshift({ value: "所有", id: "" })
      this.params.settlementid = this.billTypeData[0].id;
    })
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
    this.selectedOrder = item;
    this.service.getSaleDetail(id)
      .then(data => {
        this.selectedOrder.detailItems = data;
        this.selectedOrder.billPrice = 0;
        data.forEach(item => {
          this.selectedOrder.billPrice += item.amount;
        })
        item.generating = false;
        // 显示窗口
        setTimeout(() => dialog.show(), 200);
      })
      .catch(err => { this.alerter.error(err, true, 2000); item.generating = false; });
  }
  private billData = {};

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
        cost += item.amount * 100;
        paycheck.amount = Number(item.amount * 100);
        return paycheck;
      })
      this.payPost = this.payCheckSingle.filter(item => item.amount != 0);
    } else {
      this.payPost = this.payData.filter(item => item.amount === 0).map(item => {
        let paycheck: any = {};
        paycheck.paymentMethod = item.id;
        paycheck.amount = Number(item.amount * 100);
        return paycheck;
      });
      this.payCheckSingle = this.payData.filter(item => item.amount || item.amount === '').map(item => {
        cost += item.amount * 100;
      })
    }
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
      // carnumber: '', // 车牌号
      // billcode: '',//工单号
      settlementcode: '',//结算单号
      starttime: '',//销售开始时间
      endtime: '',//销售结束时间
      phone: '',//手机号
      customername: '',//客户名称
      settlementid: ''//结算方式id
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
