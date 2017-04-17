import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assign-order',
  templateUrl: './assign-order.component.html',
  styleUrls: ['./assign-order.component.css']
})

export class AssignOrderComponent implements OnInit {
  private isShow=false;
  private isShowPerson=false;  
  // 指派工单表格详情点击事件
  private OnClickDetail(){
    this.isShow=true;
  }
    // 指派工单表格详情点击后的关闭事件
  private OnClickClose(){
    this.isShow=false;
  }
  // 指派工单指派以及更改指派人员事件
 private OnClickPerson(){
    this.isShowPerson=true;
  }
   // 指派工单指派以及更改指派人员关闭事件
  private OnClickPersonClose(){
    this.isShowPerson=false;
  }

  MiddleBox(id:string){
    let box=document.getElementById(id);
    let w=box.offsetWidth;
    let h=box.offsetHeight;  
    box.style.marginLeft=-(w/2)+"px";
    box.style.marginTop=-(h/2)+"px";
  }
  constructor() {
   
   }

  ngOnInit() {
     this.MiddleBox("alertDetail");
     this.MiddleBox("assignBox");
  }

}
