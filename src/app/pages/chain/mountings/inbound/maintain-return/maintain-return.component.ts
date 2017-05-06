import { Component, OnInit, Injector } from '@angular/core';
import { DataList, StorageKeys } from "app/shared/models";
import { Router } from "@angular/router";
import { MaintainReturnService, MaintainRequest} from "./maintain-return.service";
import { FormGroup, FormBuilder } from '@angular/forms';
import { TypeaheadRequestParams } from "app/shared/directives";
@Component({
  selector: 'app-maintain-return',
  templateUrl: './maintain-return.component.html',
  styleUrls: ['./maintain-return.component.css']
})
export class MaintainReturnComponent extends DataList<any>{
    productData: any;
    serviceData: any;
    listId: any;
    SearchappendList: any;

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

 private orderDetail: any;
  public get typeaheadColumns() {
    return [
      { name: 'plateNo', title: '车牌号' },
      { name: 'billCode', title: '工单号' },
      { name: 'customerName', title: '车主' },
      { name: 'brand', title: '品牌' },
      { name: 'model', title: '车型' }
    ];
  }

  // 选择之后根据id查找工单详情并替换数据
  public onPlateNoSelect($event) {
    this.SearchappendList = $event;
    this.listId = $event.id;
    this.service.getOrderItemData(this.listId)
      .then(data => {
        this.orderDetail = data
        this.serviceData = data.serviceOutputs;
        this.productData=data.productOutputs;
        console.log(data)
      });
  }

  // 车牌号模糊搜索接口调用
  public get PlatNoSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new MaintainRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.service.getOrderPageData(p);
    };
  }

  createForm() {
    this.ChooseOrderForm = this.fb.group({
      keyword: '', // 车牌号或车主姓名或工单号
    });
  }



 

}
