import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { PrintDirective } from "app/shared/directives";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: 'hq-maintain-print',
  templateUrl: './maintain-print.component.html',
  styleUrls: ['./maintain-print.component.css']
})
export class MaintainPrintComponent implements OnInit {
  ngOnInit() { }

  @Input()
  data: any;

  constructor(
  ) { }


}