import { Component, OnInit, Input } from '@angular/core';
import { SalesPrintItem } from '../sales.service';
import { OrganizationInfo, OrganizationService } from 'app/pages/organization.service';

@Component({
  selector: 'hq-sales-print',
  templateUrl: './sales-print.component.html',
  styleUrls: ['./sales-print.component.css']
})
export class SalesPrintComponent implements OnInit {

  @Input()
  private model: SalesPrintItem;

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
