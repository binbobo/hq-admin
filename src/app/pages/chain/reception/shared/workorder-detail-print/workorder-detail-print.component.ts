import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-workorder-detail-print',
  templateUrl: './workorder-detail-print.component.html',
  styleUrls: ['./workorder-detail-print.component.css']
})
export class WorkorderDetailPrintComponent implements OnInit {
  @Input()
  data: any;

  constructor() { }

  ngOnInit() {
    console.log('要打印的工单详情数据为：', this.data);
  }

}
