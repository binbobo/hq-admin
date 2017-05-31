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

  @ViewChild('createModal')
  private createModal: ModalDirective;
  @ViewChild('editModal')
  private editModal: ModalDirective;
  private warehouses: Array<SelectOption>;
  protected params: InventoryListRequest;
  private model: any;
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
    let ids = items.map(m => m['productId']).filter(m => m && m.trim());
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
    // let btn = event.target as HTMLButtonElement;
    // btn.disabled = true;
    if (!item) return false;
    this.model = JSON.parse(JSON.stringify(item));
    this.editModal.show();
    // this.inventoryService.get(item.id)
    //   .then(data => this.model = data)
    //   .then(data => this.editModal.show())
    //   .then(data => btn.disabled = false)
    //   .catch(err => {
    //     btn.disabled = false;
    //     this.alerter.error(err);
    //   });
  }

  onInventoryCreate(event) {
    this.createModal.hide();
    this.loadList();
  }

  onInventoryUpdate(event) {
    this.editModal.hide();
    this.model = null;
    this.loadList();
  }

}
