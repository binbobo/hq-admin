import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { TakeStockService } from '../take-stock.service';

@Component({
  selector: 'hq-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.css']
})
export class StockDetailComponent implements OnInit {

  private list: Array<any>;

  constructor(
    private location: Location,
    private service: TakeStockService
  ) { }

  ngOnInit() {

  }

  print() {
    console.log('print..');
    var headstr = "<html><head><title></title></head><body>";
    var footstr = "</body>";
    var newstr = document.body.innerHTML;
    var oldstr = document.body.innerHTML;
   // document.body.innerHTML = headstr + newstr + footstr;
    var myWindow = window.open()
    myWindow.document.write('<link href="https://cdn.bootcss.com/bootstrap/4.0.0-alpha.6/css/bootstrap-grid.css" rel="stylesheet">');
    myWindow.document.write(newstr);
    myWindow.focus()
    myWindow.print();
    return false;
  }

  export() {

  }

}
