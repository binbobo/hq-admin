import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'hq-workshop-order-operation',
  templateUrl: './workshop-order-operation.component.html',
  styleUrls: ['./workshop-order-operation.component.css']
})
export class WorkshopOrderOperationComponent implements OnInit {
  @Input()
  selectedOrder: any;

  constructor() { }

  ngOnInit() {
  }
}
