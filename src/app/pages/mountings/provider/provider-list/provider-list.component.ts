import { Component, OnInit, Injector, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { ProviderService, ProviderListRequest, Provider } from '../provider.service';
import { DataList } from 'app/shared/models';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'hq-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.css']
})
export class ProviderListComponent extends DataList<Provider> implements OnInit {

  @ViewChild('createModal')
  public createModal: ModalDirective;
  @ViewChild('editModal')
  public editModal: ModalDirective;

  private enabled() {
    let items = this.selectedItems;
    if (!items) return;
    let ids = items.map(m => m.id).filter(m => m && m.trim());
    if (!ids || !ids.length) return;
    console.log(ids);
    this.providerService.enable(ids)
      .then(() => this.loadList())
      .catch(err => this.alerter.error(err));
  }

  private provider: Provider;

  constructor(
    injector: Injector,
    private providerService: ProviderService,
    private el: ElementRef
  ) {
    super(injector, providerService);
    this.params = new ProviderListRequest();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  private onProviderEdit($event: Provider) {
    this.service.get($event.id)
      .then(data => this.provider = data)
      .then(data => this.editModal.show());
  }

  private onProviderCreate($event) {
    this.createModal.hide();
  }

  private onProviderUpdate($event) {
    this.editModal.hide();
  }
}
