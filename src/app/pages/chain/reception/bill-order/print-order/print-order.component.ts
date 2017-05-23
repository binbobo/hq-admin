import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import { BillOrderService } from "app/pages/chain/reception/bill-order/bill-order.service";
import { PrintDirective } from 'app/shared/directives';

@Component({
  selector: 'hq-print-order',
  templateUrl: './print-order.component.html',
  styleUrls: ['./print-order.component.css']
})
export class PrintOrderComponent implements OnInit {

  @ViewChild('printer')
  public printer: PrintDirective;

  constructor(
    private route: ActivatedRoute,
    protected service: BillOrderService
  ) {
  }
  @Input()
  data: any;
  ngOnInit() {
  }

}
