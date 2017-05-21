import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { PrintDirective } from "app/shared/directives";
import { ActivatedRoute, Params } from "@angular/router";

@Component({
  selector: 'hq-distribute-print',
  templateUrl: './distribute-print.component.html',
  styleUrls: ['./distribute-print.component.css']
})
export class DistributePrintComponent implements OnInit {

  constructor(

  ) {
  }
  @Input()
  data: any;
  ngOnInit() {
  }
}
