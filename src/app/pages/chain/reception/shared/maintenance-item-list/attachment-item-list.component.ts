import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-attachment-item-list',
  templateUrl: './attachment-item-list.component.html',
  styleUrls: ['./attachment-item-list.component.css']
})
export class AttachmentItemListComponent implements OnInit {
  @Input()
  attachServiceOutputs: any;
  @Input()
  showCaption = false;

  constructor() { }

  ngOnInit() {
  }

}
