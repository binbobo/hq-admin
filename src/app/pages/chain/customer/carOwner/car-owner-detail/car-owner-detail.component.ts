import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-car-owner-detail',
  templateUrl: './car-owner-detail.component.html',
  styleUrls: ['./car-owner-detail.component.css']
})
export class CarOwnerDetailComponent implements OnInit {
  @Input()
  data: any;

  constructor() { }

  ngOnInit() {
  }

}
