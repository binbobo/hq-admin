import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-distribute-print',
  templateUrl: './distribute-print.component.html',
  styleUrls: ['./distribute-print.component.css']
})
export class DistributePrintComponent implements OnInit {

  constructor() { }
  @Input() detail
  @Input() detailItems
  @Input() detailItemsLength
  ngOnInit() {

  }

}
