import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-pre-check-order-detail',
  templateUrl: './pre-check-order-detail.component.html',
  styleUrls: ['./pre-check-order-detail.component.css']
})
export class PreCheckOrderDetailComponent implements OnInit {
  @Input()
  data: any;

  emptyText = '暂无';

  constructor() { }

  ngOnInit() {
  }

}
