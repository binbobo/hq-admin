import { Component, OnInit, Injector } from '@angular/core';
import { DataList, StorageKeys } from "app/shared/models";
import { Router } from "@angular/router";
import { MaintainReturnService, MaintainRequest } from "./maintain-return.service";
import { FormGroup, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-maintain-return',
  templateUrl: './maintain-return.component.html',
  styleUrls: ['./maintain-return.component.css']
})
export class MaintainReturnComponent extends DataList<any>{

  ChooseOrderForm: FormGroup;
  params: MaintainRequest;
  constructor(
    private router: Router,
    injector: Injector,
    protected service: MaintainReturnService,
    private fb: FormBuilder) {
      super(injector,service)
    this.params = new MaintainRequest();
    // 构建表单
    this.createForm();
  }
  onSearch(){

  }
  public items: Array<string> = ['Amsterdam', 'Antwerp', 'Athens', 'Barcelona',
    'Berlin', 'Birmingham', 'Bradford', 'Bremen', 'Brussels', 'Bucharest',
    'Budapest', 'Cologne', 'Copenhagen', 'Dortmund', 'Dresden', 'Dublin',
    'Düsseldorf', 'Essen', 'Frankfurt', 'Genoa', 'Glasgow', 'Gothenburg',
    'Hamburg', 'Hannover', 'Helsinki', 'Kraków', 'Leeds', 'Leipzig', 'Lisbon',
    'London', 'Madrid', 'Manchester', 'Marseille', 'Milan', 'Munich', 'Málaga',
    'Naples', 'Palermo', 'Paris', 'Poznań', 'Prague', 'Riga', 'Rome',
    'Rotterdam', 'Seville', 'Sheffield', 'Sofia', 'Stockholm', 'Stuttgart',
    'The Hague', 'Turin', 'Valencia', 'Vienna', 'Vilnius', 'Warsaw', 'Wrocław',
    'Zagreb', 'Zaragoza', 'Łódź'];

  private value: any = {};

  public selected(value: any): void {
    console.log('Selected value is: ', value);
  }



  createForm() {
    this.ChooseOrderForm = this.fb.group({
      keyword: '', // 车牌号或车主姓名或工单号
    });
  }


  // 工单列表
  private orderlist: any = [{
    a: 111111,
    b: "类型",
    c: "凡凡",
    d: "mini",
    e: "suv",
    f: "3333333",
    g: "78km",
    h: "2015.2.23",
    i: "2015.4.23"
  }, {
    a: 111111,
    b: "类型",
    c: "凡凡",
    d: "mini",
    e: "suv",
    f: "3333333",
    g: "78km",
    h: "2015.2.23",
    i: "2015.4.23"
  }];
  // 维修项目
  private repairorder = [{
    a: 1,
    b: "项目一",
    c: "凡凡"
  },
  {
    a: 2,
    b: "项目二",
    c: "明明"
  }]
  // 维修退料
  private returnpart = [{
    a: 1,
    b: "轮胎",
    c: "A1",
    d: "轮胎",
    e: "大",
    f: "mini",
    h: "仓库一",
    i: "库位一",
    g: "3",
    k: 123,
    l: "369",
    m: "无",
    n: "领料人一",
    o: "退料人一"
  }, {
    a: 1,
    b: "轮胎",
    c: "A1",
    d: "轮胎",
    e: "大",
    f: "mini",
    h: "仓库一",
    i: "库位一",
    g: "3",
    k: 123,
    l: "369",
    m: "无",
    n: "领料人一",
    o: "退料人一"
  }]

  OnChooseOrder(evt, modalDialog) {
    evt.preventDefault();

    modalDialog.show();
  }


}
