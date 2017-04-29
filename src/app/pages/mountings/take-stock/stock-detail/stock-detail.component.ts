import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { TakeStockService } from '../take-stock.service';
import { element } from 'protractor';
import { PrintDirective } from 'app/shared/directives';

@Component({
  selector: 'hq-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.css']
})
export class StockDetailComponent implements OnInit {

  private list: Array<any> = [];
  private printing: boolean = false;
  @ViewChild('printer') public printer:PrintDirective;

  constructor(
    private location: Location,
    private service: TakeStockService
  ) { }

  ngOnInit() {
    for (var i = 0; i <= 40; i++) {
      this.list.push({ number: i });
    }
  }

  print() {
    this.printer.print();
  }

  export() {

  }

}
