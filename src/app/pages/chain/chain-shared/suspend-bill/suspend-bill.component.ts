import { Component, OnInit, Input, EventEmitter, HostBinding, Output, ElementRef } from '@angular/core';
import { SuspendBillService, SuspendedBillItem } from './suspend-bill.service';
import { PagedResult } from 'app/shared/models';
import { SuspendBillColumn } from './suspend-bill.directive';

@Component({
  selector: 'hq-suspend-bill',
  templateUrl: './suspend-bill.component.html',
  styleUrls: ['./suspend-bill.component.css'],
  providers: [SuspendBillService],
  host: {
    style: 'position:absolute;right:10px;top:9px;',
  },
})
export class SuspendBillComponent implements OnInit {

  @Input()
  public type: string;
  @Input()
  public columns: Array<SuspendBillColumn>;
  @Output()
  public onRemove: EventEmitter<SuspendedBillItem> = new EventEmitter<SuspendedBillItem>();
  @Output()
  public onSelect: EventEmitter<SuspendedBillItem> = new EventEmitter<SuspendedBillItem>();
  public result: PagedResult<SuspendedBillItem>;
  public resultHandle: (result) => void;
  private faIcon = "fa-angle-up";

  constructor(
    private service: SuspendBillService,
    private ele: ElementRef
  ) { }

  ngOnInit() {
    this.loadList();
  }

  upclick() {
    let el = this.ele.nativeElement as HTMLElement;
    let isUp = el.getElementsByClassName("btn-group")[0].className.indexOf("show") > -1;
    if (isUp) {
      this.faIcon = "fa-angle-up"
    } else {
      this.faIcon = "fa-angle-down"
    }
  }
  loadList() {
    this.result = null;
    this.service.get(this.type)
      .then(result => this.result = result)
      .then(result => this.resultHandle && this.resultHandle(this.result))
      .catch(err => console.error(err));
  }
  remove(event: Event, item) {
    event.preventDefault();
    event.stopPropagation();
    if (confirm('作废后将不可恢复，是否确认作废？')) {
      this.service.delete(item.id)
        .then(() => this.onRemove.emit(item))
        .then(() => this.loadList())
        .catch(err => alert(err));
    }
  }
}
