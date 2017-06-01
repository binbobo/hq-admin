import { Component, OnInit, Injector, ViewChild, Input } from '@angular/core';
import { PrintDirective } from "app/shared/directives";
import { ActivatedRoute, Params } from "@angular/router";
import { EmployeeService } from 'app/pages/employee.service';
import { OrganizationService } from 'app/pages/organization.service';

@Component({
  selector: 'hq-distribute-print',
  templateUrl: './distribute-print.component.html',
  styleUrls: ['./distribute-print.component.css']
})
export class DistributePrintComponent implements OnInit {

  @Input()
  data: any;
 ngOnInit() {
    this.employeeService.getEmployee().then(data => {
      this.employeeInfo = data;
    });
    this.organizationInfo = this.organizationService.getOrganization().then(data => {
      this.organizationInfo = data;
    }); 
  }
  employeeInfo: any; // 员工信息
  organizationInfo: any; // 门店信息

  constructor(private employeeService: EmployeeService, private organizationService: OrganizationService) { }
}
