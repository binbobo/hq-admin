import { Component, OnInit, Input, ElementRef, EventEmitter } from '@angular/core';

@Component({
  selector: 'hq-alerter',
  templateUrl: './hq-alerter.component.html',
  styleUrls: ['./hq-alerter.component.css'],
})
export class HqAlerterComponent implements OnInit {

  @Input()
  public alerts: Array<Object> = [];
  public onShow = new EventEmitter();

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.onShow.subscribe(() => this.el.nativeElement.scrollIntoView(false));
  }

  public closeAlert(i: number): void {
    var current = this.alerts[i];
    let event = current['onClose'] as EventEmitter<void>;
    if (event !== null) {
      event.emit();
    }
    this.alerts.splice(i, 1);
  }
}
