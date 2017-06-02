import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-receive-print',
  templateUrl: './receive-print.component.html',
  styleUrls: ['./receive-print.component.css']
})
export class ReceivePrintComponent implements OnInit {

  constructor() { }
  @Input() detail
  @Input() detailItems
  @Input() detailItemsLength
  ngOnInit() {
  }

}
