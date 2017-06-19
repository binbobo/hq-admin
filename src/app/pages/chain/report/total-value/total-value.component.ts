import { Component, OnInit, Injector } from '@angular/core';
import { DataList } from 'app/shared/models';
import { TotalValue, TotalValueService, TotalValueSearchParams } from './total-value.service';
import { OrganizationService, OrganizationInfo } from 'app/pages/organization.service';

@Component({
  selector: 'hq-total-value',
  templateUrl: './total-value.component.html',
  styleUrls: ['./total-value.component.css']
})
export class TotalValueComponent extends DataList<TotalValue> implements OnInit {

  params: TotalValueSearchParams = new TotalValueSearchParams();
  private org: OrganizationInfo;
  private stations: Array<any>;
  private natures: Array<any>;
  private selectedStations: Array<any> = [];

  constructor(
    injector: Injector,
    private orgService: OrganizationService,
    private totalValueService: TotalValueService,
  ) {
    super(injector, totalValueService);
  }

  ngOnInit() {
    this.orgService.getOrganization()
      .then(org => this.org = org)
      .then(org => org && org.type === 1 && this.loadNatures())
      .catch(err => console.log(err));
    super.ngOnInit();
    this.loadStations();
  }

  loadNatures() {
    this.totalValueService.getNatureList()
      .then(data => this.natures = data)
      .catch(err => this.alerter.warn(err));
  }

  loadStations(nature?: string) {
    this.totalValueService.getStationTreeView(nature)
      .then(data => this.stations = data)
      .catch(err => this.alerter.error(err));
  }

  onNatureChange(event: Event) {
    let el = event.target as HTMLSelectElement;
    this.loadStations(el.value);
  }

  onStationSelect(event) {
    this.selectedStations = event;
  }

  onStationRemove(event) {
    let index = this.selectedStations.indexOf(event);
    if (~index) {
      this.selectedStations.splice(index, 1);
      this.resetStations(this.stations);
      this.stations = this.stations.slice();
    }
  }

  private resetStations(stations: Array<any>) {
    if (!Array.isArray(stations)) return;
    stations.forEach(m => {
      m.checked = this.selectedStations.findIndex(s => s.value === m.value) >= 0;
      this.resetStations(m.children);
    });
  }

  loadList() {
    this.params.orgIds = this.selectedStations.map(m => m.value);
    return super.loadList();
  }

}
