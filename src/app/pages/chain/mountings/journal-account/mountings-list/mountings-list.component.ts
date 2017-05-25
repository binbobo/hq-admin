import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { TypeaheadRequestParams } from "app/shared/directives";
import { JournalAccountService } from '../journal-account.service';

@Component({
  selector: 'hq-mountings-list',
  templateUrl: './mountings-list.component.html',
  styleUrls: ['./mountings-list.component.css']
})
export class MountingsListComponent {

  constructor(private accountService: JournalAccountService, ) {

  }

  private item: any;
  @Output()
  private selectItem: EventEmitter<any> = new EventEmitter<any>();

  private onItemSelect(item: any) {
    this.accountService.getProduct(item.id)
      .then(data => this.item = data)
      .then(data => this.selectItem.emit(item))
      .catch(err => this.selectItem.emit(err));
  }
}
