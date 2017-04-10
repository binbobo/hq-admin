import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  @Input()
  private loading: boolean;

  constructor() { }

  ngOnInit() {
  }

}
