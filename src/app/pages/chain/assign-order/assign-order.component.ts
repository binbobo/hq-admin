import { Component, OnInit,ViewChild,Injector} from '@angular/core';
import { DataList } from '../../../shared/models/data-list';
import { AlerterService } from 'app/shared/services';
import { OrderService, OrderListRequest, Order } from '../order.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-assign-order',
  templateUrl: './assign-order.component.html',
  styleUrls: ['./assign-order.component.css'],
})

export class AssignOrderComponent  extends DataList<Order> {
  public alerts: any = [];

   // 指派工单指派以及更改指派人员关闭事件
  public OnClickPersonClose(){

     this.alerts.push({
      type: 'info',
      msg: `指派成功！`,
      timeout: 3000
    });
  }


  constructor( injector: Injector,
    protected service: OrderService) {
   super(injector, service);
    this.params = new OrderListRequest();
   }



}
