import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'hq-payment-show',
  templateUrl: './payment-show.component.html',
  styleUrls: ['./payment-show.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PaymentShowComponent implements OnInit {

  public payment: Array<any>;
  // private direction: any = "bottom";
  constructor() { }

  ngOnInit() {
  }
  // onDirection(e) {
  //   let dc = document.documentElement.clientHeight || document.body.clientHeight;
  //   let sc = dc / 2;
  //   if (e.clientY - sc > 0) {
  //     this.direction = "top"
  //   } else {
  //     this.direction = "bottom"
  //   }
  // }

}
