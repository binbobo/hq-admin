import { Component, OnInit, Input } from '@angular/core';
import { OrganizationInfo, OrganizationService } from 'app/pages/organization.service';
import { EmployeeService, EmployeeInfo } from "app/pages/employee.service";

@Component({
  selector: 'hq-return-print',
  templateUrl: './return-print.component.html',
  styleUrls: ['./return-print.component.css']
})
export class ReturnPrintComponent implements OnInit {

  @Input()
  private model: any;

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
