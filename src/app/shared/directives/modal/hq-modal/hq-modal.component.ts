import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'hq-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './hq-modal.component.html',
  styleUrls: ['./hq-modal.component.css']
})
export class HqModalComponent implements OnInit {

  @ViewChild('modal')
  public modal: ModalDirective;
  @Input()
  public config: any;
  @Input()
  public title: string;
  @Input()
  public size: string;
  @Output()
  public onHide: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  public onShow: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {

  }

  constructor() {

  }

  get cfg() {
    return Object.assign({}, defaultConfig, this.config);
  }
}

const defaultConfig = {
  backdrop: "static",
  keyboard: true,
  show: false,
  ignoreBackdropClick: true
}