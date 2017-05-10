import { Component, OnInit, ViewChild } from '@angular/core';
import { PrintDirective } from 'app/shared/directives';
import { ActivatedRoute, Params } from '@angular/router';
import { OrderService } from '../../order.service';
import { StorageKeys } from 'app/shared/models';

@Component({
  selector: 'hq-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  @ViewChild('printer')
  public printer: PrintDirective;

  // 保存当前选择的工单数据
  selectedOrder = null;

  // 当前登录用户信息
  public user = null;

  constructor(
    private route: ActivatedRoute,
    private service: OrderService
  ) { }

  ngOnInit() {
    // 获取当前登录用户信息
    this.user = JSON.parse(sessionStorage.getItem(StorageKeys.Identity));

    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      this.service.get(id)
        .then(data => {
          console.log('当前要打印的工单详情数据为：', data);
          this.selectedOrder = data;
        })
        .catch(err => console.log(err));
    });
  }
  print() {
    this.printer.print();
  }

}
