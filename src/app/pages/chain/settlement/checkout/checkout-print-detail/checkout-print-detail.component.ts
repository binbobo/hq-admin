import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-checkout-print-detail',
  templateUrl: './checkout-print-detail.component.html',
  styleUrls: ['./checkout-print-detail.component.css']
})
export class CheckoutPrintDetailComponent implements OnInit {

  constructor() { }
  @Input()
  data: any;
  ngOnInit() {
  }

}
