import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-procurement-print',
  templateUrl: './procurement-print.component.html',
  styleUrls: ['./procurement-print.component.css']
})
export class ProcurementPrintComponent implements OnInit {

  constructor() { }

  @Input() detail
  @Input() detailItems 
  @Input() detailItemsLength
  
  ngOnInit() {
  }

}
