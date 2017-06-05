import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css']
})
export class VehicleListComponent implements OnInit {
  @Input()
  data: any;

  constructor() { }

  ngOnInit() {
  }

}
