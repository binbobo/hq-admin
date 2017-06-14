import { Component, OnInit, Input } from '@angular/core';
import { ReceivePrintItem } from '../receive.service';
import { OrganizationInfo, OrganizationService } from 'app/pages/organization.service';
import { EmployeeService, EmployeeInfo } from 'app/pages/employee.service';

@Component({
  selector: 'hq-receive-print',
  templateUrl: './receive-print.component.html',
  styleUrls: ['./receive-print.component.css']
})
export class ReceivePrintComponent implements OnInit {

  @Input()
  private model: ReceivePrintItem;

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
