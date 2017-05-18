import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'hq-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class PrintComponent implements OnInit {

  public html: string;

  constructor() { }

  ngOnInit() {
  }

}
