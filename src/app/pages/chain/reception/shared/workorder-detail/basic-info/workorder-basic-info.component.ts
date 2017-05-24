import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-workorder-basic-info',
  templateUrl: './workorder-basic-info.component.html',
  styleUrls: ['./workorder-basic-info.component.css']
})
export class WorkorderBasicInfoComponent implements OnInit {
  @Input()
  data: any;

  constructor() { }

  ngOnInit() {
  }

}
