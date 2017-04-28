import { Component, OnInit, EventEmitter, Output, Injector } from '@angular/core';
import { DataList, SelectOption } from 'app/shared/models';
import { TakeStockService } from '../take-stock.service';
import { MountingsService } from '../../mountings.service';
import { CreateStock, StockListCreateService, CreateStockListRequest } from './stock-list-create.service';

@Component({
  selector: 'hq-stock-list-create',
  templateUrl: './stock-list-create.component.html',
  styleUrls: ['./stock-list-create.component.css']
})
export class StockListCreateComponent extends DataList<CreateStock> implements OnInit {

  @Output()
  private onSubmit = new EventEmitter<void>();
  @Output()
  private onCancel = new EventEmitter<void>();

  private houses: Array<SelectOption>;
  private locations: Array<SelectOption>;

  constructor(
    injector: Injector,
    service: StockListCreateService,
    private moutingsService: MountingsService,
  ) {
    super(injector, service);
    this.params = new CreateStockListRequest();
  }

  ngOnInit() {
    super.ngOnInit();
    this.moutingsService.getWarehouseOptions()
      .then(data => data && data.length ? data : Promise.reject('没有可用的仓库信息！'))
      .then(data => this.houses = data)
      .then(data => this.loadLocations(data[0].value))
      .catch(err => this.alerter.error(err))
  }

  onSelectHouse(event: Event) {
    let el = event.target as HTMLInputElement;
    let id = el.value;
    this.loadLocations(id);
  }

  loadLocations(id: string) {
    this.moutingsService.getLocationByHouseId(id)
      .then(data => data && data.length ? data : Promise.reject('没有可用的库位信息！'))
      .then(data => this.locations = data)
      .catch(err => this.alerter.error(err));
  }

  cancel() {
    this.onCancel.emit();
  }

  generator() {
    this.onSubmit.emit();
  }

}
