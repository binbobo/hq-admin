import { Component, EventEmitter, Input, Output, ViewEncapsulation, OnChanges } from '@angular/core';

@Component({
  selector: 'hq-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  host: {
    style: 'margin-bottom:10px;display:block'
  },
  encapsulation: ViewEncapsulation.None,
})
export class PaginationComponent {

  @Input() loading: boolean;
  @Input() totalItems: number;
  @Input() currentPage: number;
  @Input() maxSize: number = 10;
  @Input() itemsPerPage: number = 10;
  @Input() boundaryLinks: boolean = true;
  @Output() numPages = new EventEmitter<any>();
  @Output() pageChanged = new EventEmitter<any>();
  @Output() currentPageChange = new EventEmitter<number>();

  constructor() { }

  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onPageChanged(event) {
    this.currentPageChange.emit(this.currentPage);
    this.pageChanged.emit(event);
  }

  onNumPages(event) {
    this.numPages.emit(event);
  }

  onIndexChange(event: Event) {
    let ele = event.target as HTMLInputElement;
    let value = parseInt(ele.value);
    if (isNaN(value)) return;
    this.currentPage = value;
  }

  onSizeChange($event: Event) {
    let ele = event.target as HTMLSelectElement;
    let value = parseInt(ele.value);
    if (isNaN(value)) return;
    this.itemsPerPage = value;
    this.pageChanged.emit({ page: this.currentPage, itemsPerPage: value });
  }

}
