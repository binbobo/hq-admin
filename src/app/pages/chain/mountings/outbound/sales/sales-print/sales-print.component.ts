import { Component, OnInit, Input } from '@angular/core';
import { SalesPrintItem } from '../sales.service';

@Component({
  selector: 'hq-sales-print',
  templateUrl: './sales-print.component.html',
  styleUrls: ['./sales-print.component.css']
})
export class SalesPrintComponent implements OnInit {

  @Input()
  private model: SalesPrintItem;

  constructor() {
  }

  ngOnInit() {
  }
}
