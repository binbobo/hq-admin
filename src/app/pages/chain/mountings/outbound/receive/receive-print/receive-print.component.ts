import { Component, OnInit, Input } from '@angular/core';
import { ReceivePrintItem } from '../receive.service';
import { OrganizationInfo, OrganizationService } from 'app/pages/organization.service';

@Component({
  selector: 'hq-receive-print',
  templateUrl: './receive-print.component.html',
  styleUrls: ['./receive-print.component.css']
})
export class ReceivePrintComponent implements OnInit {

  @Input()
  private model: ReceivePrintItem;

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
