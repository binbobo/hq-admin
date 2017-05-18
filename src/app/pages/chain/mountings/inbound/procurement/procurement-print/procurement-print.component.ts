import { Component, OnInit, Input } from '@angular/core';
import { ProcurementPrintItem } from '../procurement.service';

@Component({
  selector: 'hq-procurement-print',
  templateUrl: './procurement-print.component.html',
  styleUrls: ['./procurement-print.component.css']
})
export class ProcurementPrintComponent implements OnInit {

  @Input()
  private model: ProcurementPrintItem;

  constructor() {
  }

  ngOnInit() {
  }
}
