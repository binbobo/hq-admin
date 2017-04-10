import { Component, OnInit, Input, ElementRef, EventEmitter } from '@angular/core';
import { AlerterService } from 'app/shared/services';

@Component({
  selector: 'hq-alerter',
  templateUrl: './alerter.component.html',
  styleUrls: ['./alerter.component.css'],
})
export class AlerterComponent implements OnInit {

  @Input()
  private service: AlerterService

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.service.onShow.subscribe(() => this.el.nativeElement.scrollIntoView(false));
  }

  public closeAlert(i: number): void {
    var current = this.service.alerts[i];
    let event = current['onClose'] as EventEmitter<void>;
    if (event !== null) {
      event.emit();
    }
    this.service.alerts.splice(i, 1);
  }
}
