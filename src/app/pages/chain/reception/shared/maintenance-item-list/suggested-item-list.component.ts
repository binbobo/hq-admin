import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-suggested-item-list',
  templateUrl: './suggested-item-list.component.html',
  styleUrls: ['./suggested-item-list.component.css']
})
export class SuggestedItemListComponent implements OnInit {
  @Input()
  suggestServiceOutputs: any;
  @Input()
  showCaption = false;
  @Input()
  showNo = false;
  constructor() { }

  ngOnInit() {
  }

}
