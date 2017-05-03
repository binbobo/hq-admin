import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { BillOrderService } from "app/pages/chain/reception/bill-order/bill-order.service";

@Component({
  selector: 'hq-print-order',
  templateUrl: './print-order.component.html',
  styleUrls: ['./print-order.component.css']
})
export class PrintOrderComponent implements OnInit {
  private data: any;
  private costData: any;
  private workHourData: any;
  private materialData: any;
  constructor(
    private route: ActivatedRoute,
    protected service: BillOrderService
  ) {
    this.route.params
      .switchMap((params: Params) => this.service.getPrintDetail(params['id']))
      .subscribe(data => {
        this.data = data;
        this.costData = data.totalCost; //收费结算单
        this.workHourData = data.workHours;//工时明细
        this.materialData = data.matereialDetails; //材料明细
        
      });
  }

  ngOnInit() {

  }

}
