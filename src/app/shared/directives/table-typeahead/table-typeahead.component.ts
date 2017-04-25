import { Component, OnInit, EventEmitter, Input, Output, HostBinding } from '@angular/core';
import { TableTypeaheadColumn } from './table-typeahead.directive';
import { PagedParams, PagedResult } from 'app/shared/models';

@Component({
  selector: 'hq-table-typeahead',
  templateUrl: './table-typeahead.component.html',
  host: {
    style: 'position:absolute;z-index:99999999;',
  },
  styleUrls: ['./table-typeahead.component.css']
})
export class TableTypeaheadComponent implements OnInit {

  public index = 1;
  @Input()
  public size: number = 10;
  //@HostBinding('style.top.px')
  public top: number = 0;
  //@HostBinding('style.left.px')
  public left: number = 0;
  @Input()
  public columns: Array<TableTypeaheadColumn>;
  @Output()
  public onSelect: EventEmitter<any> = new EventEmitter();
  @Output()
  public onPageChange: EventEmitter<PagedParams> = new EventEmitter<PagedParams>();
  @Input()
  public result: PagedResult<any>;

  private onItemSelect(item: any) {
    this.onSelect.emit(item);
    this.result = null;
  }

  private pageChanged($event: { page, itemsPerPage }) {
    let param = new PagedParams();
    param.setPage($event.page, $event.itemsPerPage);
    this.onPageChange.emit(param);
  }

  constructor() { }

  ngOnInit() {
  }

}
