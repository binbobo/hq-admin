import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { DataList, SelectOption } from 'app/shared/models';
import { Inventory, InventoryService, InventoryListRequest } from '../inventory.service';
import { MountingsService } from '../../mountings.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'hq-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.css']
})
export class InventoryListComponent extends DataList<Inventory> implements OnInit {

  @ViewChild('editModal')
  private editModal: ModalDirective;
  private warehouses: Array<SelectOption>;
  protected params: InventoryListRequest;

  constructor(
    injector: Injector,
    private inventoryService: InventoryService,
    private moutingsService: MountingsService,
  ) {
    super(injector, inventoryService);
    this.params = new InventoryListRequest();
  }

  ngOnInit() {
    super.ngOnInit();
    this.moutingsService.getWarehouseOptions()
      .then(options => this.warehouses = options)
      .catch(err => this.alerter.warn(err));
  }

  private enabled(event: Event) {
    let items = this.selectedItems;
    if (!items) return;
    let btn = event.target as HTMLButtonElement;
    btn.disabled = true;
    let ids = items.map(m => m.id).filter(m => m && m.trim());
    if (!ids || !ids.length) return;
    this.inventoryService.enable(ids)
      .then(() => btn.disabled = false)
      .then(() => this.loadList())
      .catch(err => {
        btn.disabled = false;
        this.alerter.error(err);
      });
  }

  export(event: Event) {
    let btn = event.target as HTMLButtonElement;
    btn.disabled = true;
    this.inventoryService.export(this.params)
      .then(() => btn.disabled = false)
      .catch(err => {
        btn.disabled = false;
        this.alerter.error(err);
      })
  }

  onEdit(event: Event, item: Inventory) {
    let btn = event.target as HTMLButtonElement;
    btn.disabled = true;
    this.editModal.show();
  }

}
