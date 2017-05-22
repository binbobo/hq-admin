import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { TypeaheadRequestParams } from "app/shared/directives";

@Component({
  selector: 'hq-mountings-list',
  templateUrl: './mountings-list.component.html',
  styleUrls: ['./mountings-list.component.css']
})
export class MountingsListComponent {

  constructor() { }

  private item: any;
  @Output()
  private selectItem: EventEmitter<any> = new EventEmitter<any>();

  private onItemSelect(item: any) {
    this.item = item;
    this.selectItem.emit(item);
  }
}
