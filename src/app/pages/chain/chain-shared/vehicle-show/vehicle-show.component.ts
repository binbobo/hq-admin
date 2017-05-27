import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'hq-vehicle-show',
  templateUrl: './vehicle-show.component.html',
  styleUrls: ['./vehicle-show.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class VehicleShowComponent implements OnInit {

  public vehicles: Array<any>;

  constructor() { }

  ngOnInit() {
  }

}
