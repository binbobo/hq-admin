import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { JournalAccountService, MountingListRequest } from '../journal-account.service';
import { TypeaheadRequestParams } from "app/shared/directives";

@Component({
  selector: 'hq-mountings-list',
  templateUrl: './mountings-list.component.html',
  styleUrls: ['./mountings-list.component.css']
})
export class MountingsListComponent {

  constructor(private service: JournalAccountService) { }

  private item: any;
  @Output()
  private selectItem: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('code')
  private code: ElementRef;
  @ViewChild('name')
  private name: ElementRef;

  private columns = [
    { name: 'code', title: '编码' },
    { name: 'name', title: '名称' },
    { name: 'price', title: '价格' },
  ];

  private onItemSelect(item: any) {
    this.item = item;
    this.selectItem.emit(item);
  }

  private get codeSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new MountingListRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.service.getMountings(p);
    };
  }

  private get nameSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new MountingListRequest(null, params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.service.getMountings(p);
    };
  }
}
