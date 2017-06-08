import { Component, OnInit, Injector, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { ProviderService, ProviderListRequest, Provider } from '../provider.service';
import { DataList } from 'app/shared/models';
import { HqModalDirective } from 'app/shared/directives';

@Component({
  selector: 'hq-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.css']
})
export class ProviderListComponent extends DataList<Provider> implements OnInit {

  @ViewChild('createModal')
  public createModal: HqModalDirective;
  @ViewChild('editModal')
  public editModal: HqModalDirective;

  private enabled() {
    let items = this.selectedItems;
    if (!items) return;
    let ids = items.map(m => m.id).filter(m => m && m.trim());
    if (!ids || !ids.length) return;
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
    this.providerService.get($event.id)
      .then(data => this.provider = data)
      .then(data => this.editModal.show());
  }

  private onProviderCreate($event) {
    this.createModal.hide();
    this.loadList();
  }

  private onProviderUpdate($event) {
    this.editModal.hide();
    this.loadList();
  }

  private export() {
    this.providerService.export(this.params)
      .catch(err => this.alerter.error(err));
  }
}
