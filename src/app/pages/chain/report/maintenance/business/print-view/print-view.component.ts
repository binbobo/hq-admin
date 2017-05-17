import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-print-view',
  templateUrl: './print-view.component.html',
  styleUrls: ['./print-view.component.css']
})
export class PrintViewComponent implements OnInit {

  @Input()
  private businessData:any;

  constructor() { }

  ngOnInit() {
  }

}
