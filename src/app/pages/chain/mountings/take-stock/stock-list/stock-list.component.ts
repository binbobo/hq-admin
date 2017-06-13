import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { DataList } from 'app/shared/models';
import { Stock, TakeStockService, StockListRequest } from '../take-stock.service';
import { HqModalDirective } from 'app/shared/directives';

@Component({
  selector: 'hq-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent extends DataList<Stock> implements OnInit {

  @ViewChild("generateModal")
  protected generateModal: HqModalDirective;

  constructor(
    injector: Injector,
    service: TakeStockService,
  ) {
    super(injector, service);
    this.params = new StockListRequest();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  onGenerate() {
    this.generateModal.hide();
    this.alerter.success('生成盘点清单成功！')
    this.loadList();
  }

}
