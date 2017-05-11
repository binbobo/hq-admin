import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { DataList, PagedResult, StorageKeys } from "app/shared/models";
import { Router } from "@angular/router";
import { DistributeService, DistributeRequest, SearchReturnData, ProductRequest } from "./distribute.service";
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { TypeaheadRequestParams, HqAlerter } from "app/shared/directives";
import * as moment from 'moment';

@Component({
  selector: 'hq-distribute',
  templateUrl: './distribute.component.html',
  styleUrls: ['./distribute.component.css'],
  providers: [DistributeService]
})
export class DistributeComponent implements OnInit {
  @ViewChild('createModal')
  private createModal: ModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
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

  }
  ngOnInit() {
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
          this.InputData.initCreatId = this.employeesData[0]["id"];
          this.InputData.initCreatName = this.employeesData[0]["name"]
        }
        var hash = {};
        this.InputData.employeesData = this.employeesData.reduce(function (item, next) {
          hash[next.name] ? '' : hash[next.name] = true && item.push(next);
          return item
        }, [])


      });

    // 根据工单号获取流水号列表
    this.service.getMainList(this.billCode).toPromise()
      .then(data => {
        console.log(data);
        this.serialData = data;
      })
  }

  serialData: any;
  serialDataList: any;



  // 车牌号模糊搜索接口调用
  public get PlatNoSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new DistributeRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return this.service.getOrderPageData(p);
    };
  }


  private newItem: any;
  private addNewItem = false


  InputData = {
    serviceName: "",
    employeesData: "",
    maintenanceItemId: "",
    initCreatId: "",
    initCreatName: ""

  }

  // 点击发料弹出发料弹框
  OnCreatBound(item) {
    this.InputData.serviceName = item.serviceName; //维修项目名称
    this.InputData.maintenanceItemId = item.id; //维修明细id
    this.InputData = { ...this.InputData };
    this.createModal.show();
  }



  private billData: any;
  // 生成发料单
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
