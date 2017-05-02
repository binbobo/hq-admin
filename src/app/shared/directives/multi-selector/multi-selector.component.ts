import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SelectOption } from 'app/shared/models';
import { PopoverConfig } from 'ngx-bootstrap';

@Component({
  selector: 'hq-multi-selector',
  templateUrl: './multi-selector.component.html',
  host: {
    '[class]': '"show popover in popover-" + placement + " " + placement',
    role: 'tooltip',
    style: 'display:block;'
  },
  styleUrls: ['./multi-selector.component.css']
})
export class MultiSelectorComponent implements OnInit {

  @Input()
  public placement: string;
  @Input()
  public title: string;
  @Input()
  public options: Array<SelectOption>;
  @Output()
  public onChange = new EventEmitter<SelectOption>();
  @Output()
  public onConfirm = new EventEmitter<Array<string>>();
  @Output()
  public onCancel = new EventEmitter();

  constructor(config: PopoverConfig) {
    Object.assign(this, config);
  }

  onStateChange(event: Event, item: SelectOption) {
    var ele = event.target as HTMLInputElement;
    item.selected = ele.checked;
    this.onChange.emit(item);
  }

  onSelectAll(event: Event) {
    let el = event.target as HTMLInputElement;
    this.options.forEach(m => {
      m.selected = el.checked;
      this.onChange.emit(m);
    });
  }

  submit() {
    let items = this.options
      .filter(m => m.selected)
      .map(m => m.value);
    this.onConfirm.emit(items);
  }

  cancel() {
    this.onCancel.emit();
  }

  ngOnInit() {

  }

}
