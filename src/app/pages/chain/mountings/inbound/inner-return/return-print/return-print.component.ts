import { Component, OnInit, Input } from '@angular/core';
import { InnerPrintItem } from "../inner-return.service";

@Component({
  selector: 'hq-return-print',
  templateUrl: './return-print.component.html',
  styleUrls: ['./return-print.component.css']
})
export class ReturnPrintComponent implements OnInit {

  @Input()
  private model: InnerPrintItem;

  constructor() { }

  ngOnInit() {
  }

}
