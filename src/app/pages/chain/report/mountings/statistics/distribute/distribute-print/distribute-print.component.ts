import { Component, OnInit, Input } from '@angular/core';
import { CentToYuanPipe, DurationHumanizePipe } from "app/shared/pipes";

@Component({
  selector: 'hq-distribute-print',
  templateUrl: './distribute-print.component.html',
  styleUrls: ['./distribute-print.component.css']
})
export class DistributePrintComponent implements OnInit {

  constructor() { }
  @Input() detail
  @Input() detailItems
  @Input() detailItemsLength
  ngOnInit() {

  }
  public newDate = this.getDate();
  toDou(n) {
    return n > 9 ? '' + n : '0' + n;
  }
  getDate() {
    let date = new Date();
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();
    let h = date.getHours();
    let mm = date.getMinutes();
    let s = date.getSeconds();
    return y + '-' + this.toDou(m) + '-' + this.toDou(d) + ' ' + this.toDou(h) + ':' + this.toDou(mm) + ':' + this.toDou(s)
  }
}
