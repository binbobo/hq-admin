import { Component, OnInit, Input } from '@angular/core';
import { ReceivePrintItem } from '../receive.service';

@Component({
  selector: 'hq-receive-print',
  templateUrl: './receive-print.component.html',
  styleUrls: ['./receive-print.component.css']
})
export class ReceivePrintComponent implements OnInit {

  @Input()
  private model: ReceivePrintItem;

  constructor() {
  }

  ngOnInit() {
  }
}
