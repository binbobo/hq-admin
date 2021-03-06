import { Component, OnInit, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { TableTypeaheadColumn } from './table-typeahead.directive';
import { PagedParams, PagedResult } from 'app/shared/models';

@Component({
  selector: 'hqTableTypeahead',
  templateUrl: './table-typeahead.component.html',
  styleUrls: ['./table-typeahead.component.css'],
  host: {
    style: 'position:relative'
  }
})
export class TableTypeaheadComponent implements OnInit {

  public index = 1;
  @Input()
  public size: number = 10;
  @Input()
  public height = 40;
  @Input()
  public minWidth = 100;
  @Input()
  public showTitle = true;
  @Input()
  public columns: Array<TableTypeaheadColumn>;
  @Output()
  public onSelect: EventEmitter<any> = new EventEmitter();
  @Output()
  public onPageChange: EventEmitter<PagedParams> = new EventEmitter<PagedParams>();
  @Input()
  public result: PagedResult<any>;
  @Input()
  public multiple: boolean;
  private hidden: boolean = true;

  private onItemSelect(item: any) {
    this.onSelect.emit(item);
    if (this.multiple) {
      this.check(item, !item.checked);
    } else {
      this.result = null;
    }
  }

  private pageChanged($event: { page, itemsPerPage }) {
    let param = new PagedParams();
    param.setPage($event.page, $event.itemsPerPage);
    this.onPageChange.emit(param);
  }

  private get visible(): boolean {
    return !this.hidden && this.result && this.result.data && this.result.data.length > 0;
  }

  public hide() {
    this.hidden = true;
    return false;
  }

  public show() {
    let result = this.result;
    if (result && result.data && result.data.length) {
      this.hidden = false;
    }
  }

  private check(item: any, checked: boolean) {
    item.checked = checked;
    this.onSelect.emit(item)
  }

  public onSelectAll($event: Event) {
    let el = $event.target as HTMLInputElement;
    if (this.result && this.result.data) {
      this.result.data.forEach(m => this.check(m, el.checked));
    }
  }

  public get allChecked(): boolean {
    if (this.result && this.result.data) {
      return this.result.data.every(m => m.checked);
    } else {
      return false;
    }
  }

  get showPagination() {
    return this.result && this.result.totalCount && this.size < this.result.totalCount;
  }

  constructor() { }

  ngOnInit() {
  }

}
