import { Component, OnInit, ViewChild } from '@angular/core';
import { TakeStockService } from '../take-stock.service';
import { element } from 'protractor';
import { PrintDirective, HqAlerter } from 'app/shared/directives';
import { ActivatedRoute, Params } from '@angular/router';
import { OrganizationInfo, OrganizationService } from "app/pages/organization.service";

@Component({
  selector: 'hq-stock-detail',
  templateUrl: './stock-detail.component.html',
  styleUrls: ['./stock-detail.component.css']
})
export class StockDetailComponent implements OnInit {

  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  private item: any;
  private printing: boolean = false;
  @ViewChild('printer')
  public printer: PrintDirective;
  private code: string;
  private org: OrganizationInfo;

  constructor(
    private route: ActivatedRoute,
    private service: TakeStockService,
    private orgService: OrganizationService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.code = params['code'];
      this.service.get(this.code)
        .then(data => this.item = data)
        .catch(err => this.alerter.error(err));
    });
    this.orgService.getOrganization()
      .then(org => this.org = org)
      .catch(err => console.log(err));
  }

  print() {
    this.printer.print();
  }

  export(event: Event) {
    let btn = event.target as HTMLButtonElement;
    btn.disabled = true;
    this.service.export(this.code)
      .then(() => btn.disabled = false)
      .catch(err => {
        btn.disabled = false;
        this.alerter.error(err);
      })
  }

}
