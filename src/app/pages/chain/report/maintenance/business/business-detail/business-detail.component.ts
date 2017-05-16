import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { BusinessService } from "../business.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { FormControlErrorDirective } from "app/shared/directives";

@Component({
  selector: 'hq-business-detail',
  templateUrl: './business-detail.component.html',
  styleUrls: ['./business-detail.component.css']
})
export class BusinessDetailComponent implements OnInit {

 costCountMoney: number;
  workCostMoney: number;
  AmaterialMoney: number;
  materialMoney: number;
  discountMoney: any;
  costMoney: number;
  // @ViewChild('printer')
  // public printer: PrintDirective;
  private data: any;
  private costData: any;
  private workHourData: any;
  private materialData: any;
  private moneyObj: any = null;
  // private businessForm: FormGroup;
  // @ViewChildren(FormControlErrorDirective)
  // private controls: QueryList<FormControlErrorDirective>;

  constructor(
    private businessService: BusinessService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
  }

  // createForm() {

  //   this.businessForm = this.formBuilder.group({
  //     plateNo: '', //车牌号
  //     billCode: '', // 工单号
  //     typeName: '', //维修类型
  //     lastEnterDate: '', //进店时间
  //     expectLeave: '', //预计交车时间
  //     overTime: '', //超时
  //     createdUserName: '', //服务顾问
  //     brand: '', //品牌
  //     model: '', //车型
  //     vin: '', //VIN
  //     mileage: '', //行驶里程
  //     purchaseDate: '', //购车时间
  //     customerName: '', //车主
  //     contactUser: '', //送修人
  //     contactInfo: '', //送修人电话
  //     introducer: '', //介绍人
  //     introPhone: '', //介绍人电话
  //     name: '', //维修技师
  //   });
  // }

}
