import { Component, OnInit, Input } from '@angular/core';
import { OrganizationInfo, OrganizationService } from 'app/pages/organization.service';

@Component({
  selector: 'hq-sales-return-print',
  templateUrl: './sales-return-print.component.html',
  styleUrls: ['./sales-return-print.component.css']
})
export class SalesReturnPrintComponent implements OnInit {

  @Input()
  private model:any;

 private org: OrganizationInfo;
  constructor(private orgService: OrganizationService) { }

  ngOnInit() {
    this.orgService.getOrganization()
      .then(org => this.org = org)
      .catch(err => console.log(err));
  }
  

}
