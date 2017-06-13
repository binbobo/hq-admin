import { Component, OnInit, Input } from '@angular/core';
import { ProcurementPrintItem } from '../procurement.service';
import { OrganizationInfo, OrganizationService } from "app/pages/organization.service";
import { EmployeeService, EmployeeInfo } from 'app/pages/employee.service';

@Component({
  selector: 'hq-procurement-print',
  templateUrl: './procurement-print.component.html',
  styleUrls: ['./procurement-print.component.css']
})
export class ProcurementPrintComponent implements OnInit {

  @Input()
  private model: ProcurementPrintItem;
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
