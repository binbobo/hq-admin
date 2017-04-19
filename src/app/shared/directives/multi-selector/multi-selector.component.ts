import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  public onConfirm = new EventEmitter();

  constructor(config: PopoverConfig) {
    Object.assign(this, config);
  }

  onStateChange(event: Event, item: SelectOption) {
    var ele = event.target as HTMLInputElement;
    item.selected = ele.checked;
    this.onChange.emit(item);
  }

  onSubmit() {
    this.onConfirm.emit();
  }

  ngOnInit() {

  }

}
