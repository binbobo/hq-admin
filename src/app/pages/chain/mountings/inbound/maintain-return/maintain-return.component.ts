import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { DataList, StorageKeys } from "app/shared/models";
import { Router } from "@angular/router";
import { MaintainReturnService, MaintainRequest } from "./maintain-return.service";
import { FormGroup, FormBuilder } from '@angular/forms';
import { TypeaheadRequestParams } from "app/shared/directives";
import { ModalDirective } from "ngx-bootstrap";
@Component({
  selector: 'app-maintain-return',
  templateUrl: './maintain-return.component.html',
  styleUrls: ['./maintain-return.component.css']
})
export class MaintainReturnComponent extends DataList<any>{
  serialData: any;
  @ViewChild('createModal')
  private createModal: ModalDirective;
  billCode: any;
  printId: any;
  productData: any;
  serviceData: any;
  listId: any;
  SearchappendList: any;
  private newItem: any;
  ChooseOrderForm: FormGroup;
  private addNewItem = false;
  params: MaintainRequest;
  constructor(
    private router: Router,
    injector: Injector,
    protected service: MaintainReturnService,
    private fb: FormBuilder) {
    super(injector, service)
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
    this.billCode = $event.billCode;

    this.service.getOrderItemData(this.listId)
      .then(data => {
        this.orderDetail = data
        this.serviceData = data.serviceOutputs;
        this.productData = data.productOutputs;

        console.log(data)
      });

    this.service.getMainList(this.billCode)
      .then(data => {
        this.serialData = data;
        this.serialData.sort((a, b) => {
          return a.serialNum - b.serialNum;
        })
      })
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
  // 是否取消退料
  finishedOrder(evt, confirmModal) {
    evt.preventDefault();
    // 显示确认框
    confirmModal.show();
  }
  // 取消退料
  onConfirmFinished(confirmModal) {
    confirmModal.hide();
    history.go(-1);
  }

  private newMainData = [];
  isableAppend = false;




  private billData: any;
  //生成退料单
  OnCreatReturnBill() {
    this.billData = {
      // billCode: this.billCode,
      billId: this.listId,
      list: this.newMainData
    }
    let postData = JSON.stringify(this.billData)
    console.log(postData);
    this.service.postReturnBill(postData).then((result) => {
      this.printId = result.data;
      console.log(this.printId);
      this.alerter.info('生成发料单成功', true, 2000);
    }).catch(err => this.alerter.error(err, true, 2000));
  }

  inputData: any;
  // 点击发料弹出发料弹框
  OnCreatBound(item) {
    console.log(item)
    this.inputData = item.list;
    this.createModal.show();
  }

  onCreate(e) {
    console.log(e)
  }
}
