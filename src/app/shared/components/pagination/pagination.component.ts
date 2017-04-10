import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'hq-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
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

  onPageChanged($event) {
    this.currentPageChange.emit(this.currentPage);
    this.pageChanged.emit($event);
  }

  onNumPages($event) {
    this.numPages.emit($event);
  }
}
