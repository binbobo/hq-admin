import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataList, StorageKeys } from "app/shared/models";
import { Router } from "@angular/router";
import { OrderListSearch, CheckOutService } from "./checkout.service";
import { HqAlerter } from "app/shared/directives";

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
  constructor(
    private router: Router,
    injector: Injector,
    protected service: CheckOutService,
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
    this.service.getPayType().then(data => {
      this.payData = data;
    })
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

  // 点击详情事件
  DetailsDialog(evt, item, id, dialog) {
    item.generating = true;
    evt.preventDefault();

    // 根据id获取工单详细信息
    this.service.get(id).then(data => {
      // 记录当前操作的工单记录
      this.selectedOrder = data;
      this.billId = this.selectedOrder["id"];
    });

    this.service.getPrintDetail(id)
      .then(data => {
        console.log('结算单', data)
        Object.assign(this.selectedOrder, data);
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
      .catch(err => { console.log(err); item.generating = true; });

    // 根据工单id获取工单材料费和工时费
    this.service.getCost(id).then(data => {
      // 工时费： 维修项目金额总和
      this.workHourFee = data.workHourCost / 100;
      this.workHourFee.toFixed(2);
      // 材料费： 维修配件金额总和
      this.materialFee = data.materialCost / 100;
      this.materialFee.toFixed(2);
      // 其它费： 0
      this.otherFee = 0;
      // 总计费： 
      this.sumFee = (data.workHourCost + data.materialCost + this.otherFee) / 100;
      this.sumFee.toFixed(2);

      this.billPrice = data.amount / 100;
      this.billPrice.toFixed(2);

    })
  }
  private billData = {};
  private billPrice;

  // 点击收银显示弹框
  OnCheckout(evt, amount, id, dialog) {
    evt.preventDefault();
    console.log(this.payData)
    // 显示窗口
    this.payData.map(item => item.amount = "");
    console.log(this.payData)
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

    console.log(this.payPost);
    if (cost != this.costMoney) {
      this.alerter.error('输入金额与应收金额不符，请重新填写！', true, 3000);
    } else {
      this.service.postPay(this.payPost, this.billId).then(() => {
        this.alerter.info('收银成功!', true, 2000).onClose(() => { dialog.hide(); this.onLoadList(); });
        this.payCheckSingle = [];
        this.payPost=[];
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
}
