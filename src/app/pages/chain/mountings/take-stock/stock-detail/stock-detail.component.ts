import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { TakeStockService } from '../take-stock.service';
import { element } from 'protractor';
import { PrintDirective, HqAlerter } from 'app/shared/directives';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'hq-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.css']
})
export class StockDetailComponent implements OnInit {

  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  private list: Array<any> = [];
  private printing: boolean = false;
  @ViewChild('printer')
  public printer: PrintDirective;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private service: TakeStockService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let code = params['code'];
      this.service.get(code)
        .then(data => this.list = data)
        .catch(err => this.alerter.error(err));
    })
  }

  print() {
    this.printer.print();
  }

  export(event: Event) {
    let btn = event.target as HTMLButtonElement;
    btn.disabled = true;
    this.service.export()
      .then(() => btn.disabled = true)
      .catch(err => {
        btn.disabled = true;
        this.alerter.error(err);
      })
  }

}
