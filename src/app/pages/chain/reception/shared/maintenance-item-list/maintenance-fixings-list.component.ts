import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-maintenance-fixings-list',
  templateUrl: './maintenance-fixings-list.component.html',
  styleUrls: ['./maintenance-fixings-list.component.css']
})
export class MaintenanceFixingsListComponent implements OnInit {
  @Input()
  productOutputs: any;
  @Input()
  showCaption = false;
  constructor() { }

  ngOnInit() {
  }

}
