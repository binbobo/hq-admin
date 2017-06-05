import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'hq-vehicle-add',
  templateUrl: './vehicle-add.component.html',
  styleUrls: ['./vehicle-add.component.css']
})
export class VehicleAddComponent implements OnInit {
  @Input()
  data: any;
  @Output() editClick = new EventEmitter<any>();
  @Output() delClick = new EventEmitter<any>();
  @Output() addClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onEditClick(vehicle) {
    this.editClick.emit(vehicle);
  }
  onDelClick(plateNo) {
    this.delClick.emit(plateNo);
  }
  onAddClick() {
    this.addClick.emit();
  }
}
