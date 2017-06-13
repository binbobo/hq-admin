import { Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'hq-vehicle-show',
  templateUrl: './vehicle-show.component.html',
  styleUrls: ['./vehicle-show.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class VehicleShowComponent implements OnInit {

  public vehicles: Array<any>;
   private direction:any="bottom";
  constructor() {}

  ngOnInit() {
  }
  onDirection(e){
    let dc=document.documentElement.clientHeight||document.body.clientHeight;
    let sc=dc/2;
    if(e.clientY-sc>0){
      this.direction="top"
    }else{
      this.direction="bottom"
    }
  }
}
