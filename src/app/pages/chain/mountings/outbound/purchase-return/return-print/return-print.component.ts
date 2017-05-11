import { Component, OnInit, Input } from '@angular/core';
import { PurchaseReturnPrintItem } from '../purchase-return.service';

@Component({
  selector: 'hq-return-print',
  templateUrl: './return-print.component.html',
  styleUrls: ['./return-print.component.css']
})
export class ReturnPrintComponent implements OnInit {

  @Input()
  private model: PurchaseReturnPrintItem;

  constructor() {
  }

  ngOnInit() {
  }
}
