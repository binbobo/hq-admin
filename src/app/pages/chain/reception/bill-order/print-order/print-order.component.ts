import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { BillOrderService } from "app/pages/chain/reception/bill-order/bill-order.service";
import { PrintDirective } from 'app/shared/directives';

@Component({
  selector: 'hq-print-order',
  templateUrl: './print-order.component.html',
  styleUrls: ['./print-order.component.css']
})
export class PrintOrderComponent implements OnInit {
    adviceItems: any=[];
    appendItems: any=[];
  costCountMoney: number;
  workCostMoney: number;
  AmaterialMoney: number;
  materialMoney: number;
  discountMoney: any;
  costMoney: number;
  @ViewChild('printer')
  public printer: PrintDirective;
  private data: any;
  private costData: any;
  private workHourData: any;
  private materialData: any=[];
  private moneyObj: any = null;
  constructor(
    private route: ActivatedRoute,
    protected service: BillOrderService
  ) {

    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      this.service.getPrintDetail(id)
        .then(data => {
          this.data = data;
          console.log('结算单',data)
          this.costData = data.totalCost; //收费结算单
          this.workHourData = data.workHours;//工时明细
          this.materialData = data.matereialDetails; //材料明细
          this.appendItems=data.appendItems;
          this.adviceItems=data.adviceItems;
          this.workHourData.forEach(item => {
            //金额
            this.moneyObj.workItemMoney = item.amount * item.discount 
            // 工时明细的应收金额和折扣金额
            this.moneyObj.workCostMoney += item.amount;
            this.moneyObj.discountMoney += item.amount * (1 - item.discount / 100) ;
          });
          this.materialData.forEach(item => {
            // 材料明细的应收金额
            this.moneyObj.materialMoney += item.amount ;
          })
          // 收费结算金额
          this.costData.forEach(item => {
            this.moneyObj.costMoney += item.receivableCost ;
            this.moneyObj.costCountMoney += (item.receivableCost - item.discountCost) ;
          })
        })
        .catch(err => console.log(err));
    });


    this.moneyObj = {
      workCostMoney: 0,
      discountMoney: 0,
      materialMoney: 0,
      costMoney: 0,
      costCountMoney: 0
    }
  }

  ngOnInit() {

  }
  print() {
    this.printer.print();
  }

}
