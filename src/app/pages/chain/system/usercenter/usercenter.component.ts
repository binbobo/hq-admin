import { Component, OnInit } from '@angular/core';
import {UserCenterService} from "./usercenter.service"

@Component({
  selector: 'hq-usercenter',
  templateUrl: './usercenter.component.html',
  styleUrls: ['./usercenter.component.css']
})
export class UsercenterComponent implements OnInit {

  constructor(
    protected service:UserCenterService
  ) { }

  ngOnInit() {
    
  }

}
