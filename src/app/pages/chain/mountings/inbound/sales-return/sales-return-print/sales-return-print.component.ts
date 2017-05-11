import { Component, OnInit, Input} from '@angular/core';
import { SalesReturnPrintItem } from '../sales-return.service';

@Component({
  selector: 'hq-sales-return-print',
  templateUrl: './sales-return-print.component.html',
  styleUrls: ['./sales-return-print.component.css']
})
export class SalesReturnPrintComponent implements OnInit {

@Input()
  private model: SalesReturnPrintItem;
  
  constructor() { }
 
  ngOnInit() {
  }

}
