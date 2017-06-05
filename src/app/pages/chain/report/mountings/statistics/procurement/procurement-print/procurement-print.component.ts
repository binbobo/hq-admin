import { Component, OnInit, Input } from '@angular/core';
import { CentToYuanPipe, DurationHumanizePipe } from "app/shared/pipes";
import { DataList } from "app/shared/models";
import { TreeviewItem, TreeviewConfig } from "ngx-treeview/lib";

@Component({
  selector: 'hq-procurement-print',
  templateUrl: './procurement-print.component.html',
  styleUrls: ['./procurement-print.component.css']
})
export class ProcurementPrintComponent implements OnInit {
  public newDate=this.getDate();
  constructor() { }

  @Input() detail
  @Input() detailItems 
  @Input() detailItemsLength
  
  ngOnInit() {
  }
  toDou(n){
    return n>9?''+n:'0'+n;
  }
  getDate(){
    let date=new Date();
    let y=date.getFullYear();
    let m=date.getMonth()+1;
    let d=date.getDate();
    let h=date.getHours();
    let mm=date.getMinutes();
    let s=date.getSeconds();
    return y+'-'+this.toDou(m)+'-'+this.toDou(d)+' '+this.toDou(h)+':'+this.toDou(mm)+':'+this.toDou(s)
  }
}
