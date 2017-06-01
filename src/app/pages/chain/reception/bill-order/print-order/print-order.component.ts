import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { PrintDirective } from 'app/shared/directives';
import { EmployeeService } from 'app/pages/employee.service';
import { OrganizationService } from 'app/pages/organization.service';

@Component({
  selector: 'hq-print-order',
  templateUrl: './print-order.component.html',
  styleUrls: ['./print-order.component.css']
})
export class PrintOrderComponent implements OnInit {

  @ViewChild('printer')
  public printer: PrintDirective;

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
