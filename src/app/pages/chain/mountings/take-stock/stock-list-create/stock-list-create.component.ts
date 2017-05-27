import { Component, OnInit, EventEmitter, Output, Injector, ViewChild } from '@angular/core';
import { DataList, SelectOption } from 'app/shared/models';
import { TakeStockService, GenerateStockListRequest } from '../take-stock.service';
import { MountingsService } from '../../mountings.service';
import { CreateStock, StockListCreateService, CreateStockListRequest } from './stock-list-create.service';
import { MultiSelectConfirmEvent, MultiSelectorDirective } from 'app/shared/directives';

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
  protected params: CreateStockListRequest;
  private houses: Array<SelectOption>;

  constructor(
    injector: Injector,
    service: StockListCreateService,
    private takeStockService: TakeStockService,
    private moutingsService: MountingsService,
  ) {
    super(injector, service);
    this.params = new CreateStockListRequest();
  }

  ngOnInit() {
    this.lazyLoad = true;
    super.ngOnInit();
    this.moutingsService.getWarehouseOptions()
      .then(data => this.houses = data)
      .then(data => {
        if (!this.params.storeId) {
          this.params.storeId = data[0].value;
        }
      })
  }

  generate(event: Event) {
    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    let request = new GenerateStockListRequest(this.params.storeId);
    this.takeStockService.create(request)
      .then(() => el.disabled = false)
      .then(() => this.onSubmit.emit())
      .catch(err => {
        el.disabled = false;
        this.alerter.error(err);
      });
  }

}
