import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maintain-return',
  templateUrl: './maintain-return.component.html',
  styleUrls: ['./maintain-return.component.css']
})
export class MaintainReturnComponent implements OnInit {
  private isShowOrder;

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
  private repairorder=[{
    a:1,
    b:"项目一",  
    c:"凡凡"   },
    {
    a:2,
    b:"项目二",
    c:"明明"
  }]
// 维修退料
private returnpart=[{
    a:1,
    b:"轮胎", 
    c:"A1"  ,
    d:"轮胎",
    e:"大",  
    f:"mini"  ,
    h:"仓库一",
    i:"库位一",  
    g:"3"  ,
    k:123,
    l:"369",  
    m:"无" ,
    n:"领料人一",
    o:"退料人一"
},{
    a:1,
    b:"轮胎", 
    c:"A1"  ,
    d:"轮胎",
    e:"大",  
    f:"mini"  ,
    h:"仓库一",
    i:"库位一",  
    g:"3"  ,
    k:123,
    l:"369",  
    m:"无" ,
    n:"领料人一",
    o:"退料人一"
}]

  OnChooseOrder() {
    if (this.isShowOrder == false) {
      this.isShowOrder = true;
    } else {
      this.isShowOrder = false;
    }


  }
  constructor() {
    this.isShowOrder = false;

  }

  ngOnInit() {
  }

}
