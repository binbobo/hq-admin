import { Component, OnInit, ViewChild } from '@angular/core';
import { HqAlerter, TypeaheadRequestParams } from "app/shared/directives";
import { PagedResult } from 'app/shared/models';
import { OrganizationService, OrganizationInfo } from '../organization.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  private org: OrganizationInfo;

  constructor(private orgService: OrganizationService) { }

  ngOnInit() {
    this.orgService.getOrganization()
      .then(org => this.org = org)
      .catch(err => console.log(err));
  }
}
