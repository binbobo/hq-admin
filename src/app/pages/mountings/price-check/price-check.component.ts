import { Component, OnInit, Injector } from '@angular/core';
import { DataList, SelectOption } from 'app/shared/models';
import { PriceCheckListModel, PriceCheckService, PriceCheckListRequest } from './price-check.service';
import { MountingsService } from '../mountings.service';

@Component({
  selector: 'hq-price-check',
  templateUrl: './price-check.component.html',
  styleUrls: ['./price-check.component.css']
})
export class PriceCheckComponent extends DataList<PriceCheckListModel> implements OnInit {

  private warehouses: Array<SelectOption>;

  constructor(
    injector: Injector,
    service: PriceCheckService,
    private moutingsService: MountingsService,
  ) {
    super(injector, service);
    this.params = new PriceCheckListRequest();
  }

  ngOnInit() {
    this.moutingsService.getWarehouseOptions()
      .then(options => this.warehouses = options)
      .catch(err => this.alerter.warn(err));
  }

}
