import { Component, OnInit, Injector } from '@angular/core';
import { DataList, StorageKeys } from "app/shared/models";
import { Router } from "@angular/router";
import { MaintainReturnService, MaintainRequest } from "./maintain-return.service";
import { FormGroup, FormBuilder } from '@angular/forms';
import { TypeaheadRequestParams } from "app/shared/directives";
@Component({
  selector: 'app-maintain-return',
  templateUrl: './maintain-return.component.html',
  styleUrls: ['./maintain-return.component.css']
})
export class MaintainReturnComponent extends DataList<any>{
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
    this.service.getOrderItemData(this.listId)
      .then(data => {
        this.orderDetail = data
        this.serviceData = data.serviceOutputs;
        this.productData = data.productOutputs;
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
  //点击退料
  OnChangeNewItem($event, id, serviceName, names, turnnames) {

    // 初始化当前编辑的
    this.newItem = {
      maintenanceItemId: id, //维修明细id
      serviceItem: serviceName,//维修项目
      createUser: "", //领料人
      brandName: '',// 品牌
      productCode: '',//配件编码
      productName: '',//配件名称
      productSpecification: '',//规格型号
      vehicleModelName: '',//车型
      storeId: '',//仓库
      locationId: '',//库位
      count: '',//数量
      price: '',//单价
      amount: '',//金额
      description: '',//备注
    };
    // 维修项目编辑区域可见
    this.addNewItem = true;
  }
  private newMainData = [];
  isableAppend = false;

  // 确定退料
  OnConfirmItem(evt?: Event) {
    // 浮点数正则表达式
    const reg = /^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/;
    // 检查数量合法性
    if (!this.newItem.count || !reg.test(this.newItem.count)) {
      this.alerter.error(" 数量格式错误，请输入数字", true, 2000)
    }
    if (!this.newItem.count) {
      this.alerter.error(" 数量不能为空", true, 2000);
      return false;
    }

    if (evt) {
      evt.preventDefault();
    }
    this.newMainData.push(this.newItem);
    // 编辑区域不可见
    this.addNewItem = false;
    if (this.newMainData.length > 0) {
      this.isableAppend = true;
    }
  }
  //  新增数据删除
  OnDelItem(evt) {
    evt.preventDefault();
    this.newMainData.filter((item, index) => {
      this.newMainData.splice(index, 1);
      return;
    });

  }

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

}
