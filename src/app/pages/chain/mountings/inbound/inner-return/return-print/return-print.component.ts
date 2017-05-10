import { Component, OnInit, Input } from '@angular/core';
import { InnerListRequest } from "../inner-return.service";

@Component({
  selector: 'hq-return-print',
  templateUrl: './return-print.component.html',
  styleUrls: ['./return-print.component.css']
})
export class ReturnPrintComponent implements OnInit {

  private now: number;
  @Input()
  private item: InnerListRequest;
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
