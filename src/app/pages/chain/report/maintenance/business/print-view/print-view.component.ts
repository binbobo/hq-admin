import { Component, OnInit, Input } from '@angular/core';
import { EmployeeService, EmployeeInfo } from "app/pages/employee.service";

@Component({
  selector: 'hq-print-view',
  templateUrl: './print-view.component.html',
  styleUrls: ['./print-view.component.css']
})
export class PrintViewComponent implements OnInit {

  @Input()
  private businessData:any;

  private employee: EmployeeInfo;

  constructor(
    private employeeService: EmployeeService,
  ) { }

  ngOnInit() {
    this.employeeService.getEmployee()
      .then(data => this.employee = data)
      .catch(err => console.log(err));
  }

}
