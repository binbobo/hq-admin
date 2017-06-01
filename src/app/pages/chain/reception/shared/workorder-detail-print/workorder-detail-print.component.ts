import { Component, OnInit, Input } from '@angular/core';
import { EmployeeService } from 'app/pages/employee.service';
import { OrganizationService } from 'app/pages/organization.service';

@Component({
  selector: 'hq-workorder-detail-print',
  templateUrl: './workorder-detail-print.component.html',
  styleUrls: ['./workorder-detail-print.component.css']
})
export class WorkorderDetailPrintComponent implements OnInit {
  @Input()
  data: any;

  employeeInfo: any; // 员工信息
  organizationInfo: any; // 门店信息

  constructor(private employeeService: EmployeeService, private organizationService: OrganizationService) { }

  ngOnInit() {
    this.employeeService.getEmployee().then(data => {
      this.employeeInfo = data;
      console.log(data);
    });
    this.organizationService.getOrganization().then(data => {
      this.organizationInfo = data;
      console.log(data);
    });
  }

}
