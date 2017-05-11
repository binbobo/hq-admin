import { Component, OnInit, Input, EventEmitter, HostBinding } from '@angular/core';
import { SuspendBillsService, SuspendedBillItem } from './suspend-bill.service';
import { PagedResult } from 'app/shared/models';
import { SuspendBillColumn } from './suspend-bill.directive';

@Component({
  selector: 'hq-suspend-bill',
  templateUrl: './suspend-bill.component.html',
  styleUrls: ['./suspend-bill.component.css'],
  providers: [SuspendBillsService]
})
export class SuspendBillComponent implements OnInit {

  @HostBinding("class")
  private class = "pull-right";
  @Input()
  public type: string;
  @Input()
  public columns: Array<SuspendBillColumn>;
  public result: PagedResult<SuspendedBillItem>;
  public onSelect = new EventEmitter<SuspendedBillItem>();

  constructor(
    private service: SuspendBillsService
  ) { }

  ngOnInit() {
    this.loadList();
  }

  loadList() {
    this.service.get(this.type)
      .then(result => this.result = result)
      .catch(err => console.error(err));
  }

  remove(event: Event, item) {
    event.preventDefault();
    event.stopPropagation();
    if (confirm('确定要删除当前挂单信息？')) {
      this.service.delete(item.id)
        .then(() => this.loadList())
        .catch(err => alert(err));
    }
  }
}