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
  private item: any;
  private printing: boolean = false;
  @ViewChild('printer')
  public printer: PrintDirective;
  private code: string;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private service: TakeStockService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.code = params['code'];
      this.service.get(this.code)
        .then(data => this.item = data)
        .catch(err => this.alerter.error(err));
    })
  }

  print() {
    this.printer.print();
  }

  export(event: Event) {
    let btn = event.target as HTMLButtonElement;
    btn.disabled = true;
    this.service.export(this.code)
      .then(() => btn.disabled = false)
      .catch(err => {
        btn.disabled = false;
        this.alerter.error(err);
      })
  }

}
