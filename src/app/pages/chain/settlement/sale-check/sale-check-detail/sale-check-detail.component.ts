import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'hq-sale-check-detail',
  templateUrl: './sale-check-detail.component.html',
  styleUrls: ['./sale-check-detail.component.css']
})
export class SaleCheckDetailComponent implements OnInit {

  constructor() { }

 @Input()
  data: any;
  ngOnInit() {
  }
}
