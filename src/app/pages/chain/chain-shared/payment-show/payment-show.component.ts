import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'hq-payment-show',
  templateUrl: './payment-show.component.html',
  styleUrls: ['./payment-show.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PaymentShowComponent implements OnInit {

  public payment: Array<any>;
  constructor() { }

  ngOnInit() {
  }
}
