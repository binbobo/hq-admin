import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-fee-statistics',
  templateUrl: './fee-statistics.component.html',
  styleUrls: ['./fee-statistics.component.css']
})
export class FeeStatisticsComponent implements OnInit {
  @Input()
  fee: any;
  
  constructor() { }

  ngOnInit() {
  }

}
