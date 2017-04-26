import { Component, OnInit, Injector } from '@angular/core';
import { ProviderService, ProviderListRequest, Provider } from '../provider.service';
import { DataList } from 'app/shared/models';

@Component({
  selector: 'hq-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.css']
})
export class ProviderListComponent extends DataList<Provider> implements OnInit {

  constructor(
    injector: Injector,
    service: ProviderService,
  ) {
    super(injector, service);
    this.params = new ProviderListRequest();
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
