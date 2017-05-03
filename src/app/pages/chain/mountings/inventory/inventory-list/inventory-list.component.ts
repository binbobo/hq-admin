import { Component, OnInit, Injector } from '@angular/core';
import { DataList, SelectOption } from 'app/shared/models';
import { Inventory, InventoryService, InventoryListRequest } from '../inventory.service';
import { MountingsService } from '../../mountings.service';

@Component({
  selector: 'hq-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent extends DataList<Inventory> implements OnInit {

  private warehouses: Array<SelectOption>;

  constructor(
    injector: Injector,
    service: InventoryService,
    private moutingsService: MountingsService,
  ) {
    super(injector, service);
    this.params = new InventoryListRequest();
  }

  ngOnInit() {
    super.ngOnInit();
    this.moutingsService.getWarehouseOptions()
      .then(options => this.warehouses = options)
      .catch(err => this.alerter.warn(err));
  }

}
