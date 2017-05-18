import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-workorder-detail',
  templateUrl: './workorder-detail.component.html',
  styleUrls: ['./workorder-detail.component.css']
})
export class WorkorderDetailComponent implements OnInit {
  @Input()
  data: any;
  
  constructor() { }

  ngOnInit() {
  }

}
