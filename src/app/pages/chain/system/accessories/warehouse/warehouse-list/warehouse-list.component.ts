import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { DataList } from 'app/shared/models';
import { Warehouse, WarehouseService, WarehouseSearchParams } from '../warehouse.service';

@Component({
  selector: 'hq-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.css']
})
export class WarehouseListComponent extends DataList<Warehouse> implements OnInit {

  @ViewChild('createModal')
  public createModal: ModalDirective;

  constructor(
    injector: Injector,
    private warehouseService: WarehouseService,
  ) {
    super(injector, warehouseService);
    this.params = new WarehouseSearchParams();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  private onWarehouseCreate($event) {
    this.createModal.hide();
    this.loadList();
  }
}
