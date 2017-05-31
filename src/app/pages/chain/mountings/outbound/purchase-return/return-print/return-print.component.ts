import { Component, OnInit, Input } from '@angular/core';
import { PurchaseReturnPrintItem } from '../purchase-return.service';
import { OrganizationInfo, OrganizationService } from "app/pages/organization.service";

@Component({
  selector: 'hq-return-print',
  templateUrl: './return-print.component.html',
  styleUrls: ['./return-print.component.css']
})
export class ReturnPrintComponent implements OnInit {

  @Input()
  private model: PurchaseReturnPrintItem;

  private org: OrganizationInfo;

  constructor(
    private orgService: OrganizationService
  ) { }

  ngOnInit() {
    this.orgService.getOrganization()
      .then(org => this.org = org)
      .catch(err => console.log(err));
  }
}
