import { Component, OnInit, Input } from '@angular/core';
import { SalesPrintItem } from '../sales.service';
import { OrganizationInfo, OrganizationService } from 'app/pages/organization.service';
import { EmployeeInfo, EmployeeService } from "app/pages/employee.service";

@Component({
  selector: 'hq-sales-print',
  templateUrl: './sales-print.component.html',
  styleUrls: ['./sales-print.component.css']
})
export class SalesPrintComponent implements OnInit {

  @Input()
  private model: SalesPrintItem;

  private org: OrganizationInfo;
  private employee: EmployeeInfo;

  constructor(
    private orgService: OrganizationService,
    private employeeService: EmployeeService,
  ) { }

  ngOnInit() {
    this.orgService.getOrganization()
      .then(org => this.org = org)
      .catch(err => console.log(err));
    this.employeeService.getEmployee()
      .then(data => this.employee = data)
      .catch(err => console.log(err));
  }
}
