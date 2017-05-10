import { Component, OnInit, Injector } from '@angular/core';
import { DataList, PagedResult, StorageKeys } from "app/shared/models";
import { Router } from "@angular/router";
import { DistributeService, DistributeRequest, SearchReturnData, ProductRequest } from "./distribute.service";
import { FormGroup, FormBuilder } from '@angular/forms';
import { TypeaheadRequestParams } from "app/shared/directives";
import * as moment from 'moment';

@Component({
  selector: 'hq-distribute',
  templateUrl: './distribute.component.html',
  styleUrls: ['./distribute.component.css'],
  providers: [DistributeService]
})
export class DistributeComponent extends DataList<any>{
  employeesData: any;
  maintenanceEmployees: any;
  isableAppend = false;
  isablePrint = false;
  printId: any;
  billCode: any;
  newMainData = [];
  productData: any;
  serviceData: any;
  listId: any;
  SearchappendList: any;
  ChooseOrderForm: FormGroup;
  constructor(
    private router: Router,
    injector: Injector,
    protected service: DistributeService,
    private fb: FormBuilder) {
    super(injector, service)
    this.params = new DistributeRequest();

  }

  private orderDetail: any;
  // 车牌号或工单号或车主姓名搜索列
  public get typeaheadColumns() {
    return [
      { name: 'plateNo', title: '车牌号' },
      { name: 'billCode', title: '工单号' },
      { name: 'customerName', title: '车主' },
      { name: 'brand', title: '品牌' },
      { name: 'model', title: '车型' }
    ];
  }
  //配件编码搜索列
  public get CodeColumns() {
    return [
      { name: 'code', title: '配件编码' },
      {}
    ];
  }
  //配件名称搜索列
  public get NameColumns() {
    return [
      { name: 'brand', title: '品牌' },
      { name: 'code', title: '配件编码' },
      { name: 'name', title: '配件名称' },
      { name: 'specification', title: '规格型号' },
      { name: 'vehicleName ', title: '车型' }
    ];
  }

  // 选择之后根据id查找工单详情并替换数据
  initCreatName: any;
  initCreatId: any;
  public onPlateNoSelect($event) {
    this.SearchappendList = $event;
    this.listId = $event.id;
    this.billCode = $event.billCode;
    this.service.getOrderItemData(this.listId)
      .then(data => {
        this.orderDetail = data
        this.serviceData = data.serviceOutputs;
        this.productData = data.productOutputs;
        this.employeesData = data.maintenanceEmployees;
        // 去重
        if (this.employeesData.length > 0) {
          this.initCreatId = this.employeesData[0]["id"];
          this.initCreatName = this.employeesData[0]["name"]
        }
        var hash = {};
        this.employeesData = this.employeesData.reduce(function (item, next) {
          hash[next.name] ? '' : hash[next.name] = true && item.push(next);
          return item
        }, [])

        console.log(this.employeesData);
        console.log(data)
      });
    // 根据工单号获取流水号列表
    
    this.service.getMainList(this.billCode).toPromise()
      .then(data => {
        console.log(data);
        this.serialData=data;

      })
  }
  
  serialData:any;
  serialDataList:any;
  valueObj: any;
  createName: any;
  createId: any;
  onSellerSelect(evt) {
    this.valueObj = evt.split(",,");
    console.log(this.valueObj);
    this.createName = this.valueObj[1];
    this.createId = this.valueObj[0];
    console.log(this.createName);

    this.newItem.createUser = this.createId;
    this.newItem.createUserName = this.createName;
  }

  // 配件编码下拉点击后
  public onCodeSelect($event) {
    console.log($event)
    this.newItem.productCode = $event.code;
    this.newItem.productSpecification = $event.specification; //规格型号
    this.newItem.brandName = $event.brand;//品牌
    this.newItem.number = $event.number;//序号
    this.newItem.vehicleModelName = $event.vehicleName;//车型
    this.newItem.houseName = $event.houseName;//仓库
    this.newItem.locationName = $event.locationName;//库位名称
    console.log(this.newItem)
  }

  public onNameSelect($event) {
    console.log($event)
    this.newItem.productName = $event.name;
    this.newItem.price = $event.price/100;//单价
    console.log(this.newItem)
  }

  // 车牌号模糊搜索接口调用
  public get PlatNoSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new DistributeRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.service.getOrderPageData(p);
    };
  }
  // 配件编码搜索
  public get CodeSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new ProductRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.service.getProductList(p);
    };

  }

  // 配件名称搜索
  public get NameSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new ProductRequest(null, params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.service.getProductList(p);
    };
  }

  private newItem: any;
  private addNewItem = false
  //  点击发料
  OnAddNewItem($event, id, serviceName, names, turnnames) {
    let Sname = names.concat(turnnames).join(',');
    // 初始化当前编辑的
    this.newItem = {
      maintenanceItemId: id, //维修明细id
      serviceItem: serviceName,//维修项目
      brandName: '',// 品牌
      productCode: '',//配件编码
      productName: '',//配件名称
      productSpecification: '',//规格型号
      vehicleModelName: '',//车型
      houseName: '',//仓库
      locationName: '',//库位
      count: '',//数量
      price: '',//单价
      amount: '',//金额
      description: '',//备注
      createUser: this.initCreatId,//领料人默认id
      createUserName: this.initCreatName//领料人默认名字
    };
    console.log(this.newItem.createUser,this.newItem.createUserName)
    // 维修项目编辑区域可见
    this.addNewItem = true;
  }
  OnDelItem(evt) {
    evt.preventDefault();
    this.newMainData.filter((item, index) => {
      this.newMainData.splice(index, 1);
      return;
    });

  }
  // 确认添加一条记录 处理程序
  OnConfirmItem(evt?: Event) {
    // 浮点数正则表达式
    const reg = /^(?=.+)(?:[1-9]\d*|0)?(?:\.\d+)?$/;
    // 检查数量合法性
    if (!this.newItem.count || !reg.test(this.newItem.count)) {
      this.alerter.error("发料数量格式错误，请输入数字", true, 2000)
    }
    if (!this.newItem.count) {
      this.alerter.error("发料数量不能为空", true, 2000);
      return false;
    }
    if (!this.newItem.productCode) {
      this.alerter.error("配件编码不能为空", true, 2000);
      return false;
    }
    if (!this.newItem.productName) {
      this.alerter.error("配件名称不能为空", true, 2000);
      return false;
    }
    if (evt) {
      evt.preventDefault();
    }
    
    this.newMainData.push(this.newItem);
    // 维修项目编辑区域不可见
    this.addNewItem = false;
    if (this.newMainData.length > 0) {
      this.isableAppend = true;
    }
  }

  private billData: any;

  OnCreatBill() {
    this.billData = {
      billCode: this.billCode,
      billId: this.listId,
      list: this.newMainData
    }
    let postData = JSON.stringify(this.billData)
    console.log(postData);
    this.service.postBill(postData).then((result) => {
      this.printId = result.data;
      console.log(this.printId);
      this.alerter.info('生成发料单成功', true, 2000);
      this.isablePrint = true;
    }).catch(err => this.alerter.error(err, true, 2000));
  }

  // 是否取消发料
  finishedOrder(evt, confirmModal) {
    evt.preventDefault();
    // 显示确认框
    confirmModal.show();
  }
  // 取消发料
  onConfirmFinished(confirmModal) {
    confirmModal.hide();
    history.go(-1);
  }


}
