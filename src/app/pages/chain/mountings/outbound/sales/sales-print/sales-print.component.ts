import { Component, OnInit, Input } from '@angular/core';
import { SalesListRequest } from '../sales.service';

@Component({
  selector: 'hq-sales-print',
  templateUrl: './sales-print.component.html',
  styleUrls: ['./sales-print.component.css']
})
export class SalesPrintComponent implements OnInit {

  private now: number;
  @Input()
  private item: SalesListRequest;
  @Input()
  private sizePerPage: number = 20;

  constructor() {
    this.now = Date.now();
  }

  list(index: number) {
    return this.items.slice(index, index + this.sizePerPage);
  }

  get items() {
    return this.item && Array.isArray(this.item.list) ? this.item.list : [];
  }

  get totalPages() {
    return Math.ceil(this.items.length / this.sizePerPage);
  }

  get pages() {
    return Array(this.totalPages)
      .fill(0)
      .map((value, index) => index);
  }

  get amount() {
    return this.items.map(m => m.amount).reduce((prev, current) => prev + current, 0);
  }

  ngOnInit() {
  }
}
