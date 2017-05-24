import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-maintenance-item-list',
  templateUrl: './maintenance-item-list.component.html',
  styleUrls: ['./maintenance-item-list.component.css']
})
export class MaintenanceItemListComponent implements OnInit {

  @Input()
  serviceOutputs: any;
  @Input()
  showCaption = false;
  constructor() { }

  ngOnInit() {
  }

}
