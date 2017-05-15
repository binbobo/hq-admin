import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { DataList, PagedResult, StorageKeys } from "app/shared/models";
import { Router, ActivatedRoute } from "@angular/router";
import { DistributeService, DistributeRequest, SearchReturnData, ProductRequest } from "./distribute.service";
import { FormGroup, FormBuilder } from '@angular/forms';
import { ModalDirective, TabsetComponent } from 'ngx-bootstrap';
import { TypeaheadRequestParams, HqAlerter } from "app/shared/directives";
import * as moment from 'moment';
import { SuspendBillDirective } from "app/pages/chain/chain-shared";

@Component({
  selector: 'hq-distribute',
  templateUrl: './distribute.component.html',
  styleUrls: ['./distribute.component.css'],
  providers: [DistributeService]
})
export class DistributeComponent implements OnInit {
  suspendedBillId: any;
  numberPrintList: any;
  @ViewChild('createModal')
  private createModal: ModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild(SuspendBillDirective)
  private suspendBill: SuspendBillDirective;
  employeesData: any;
  maintenanceEmployees: any;
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
    private route: ActivatedRoute,
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
  customerName: any;
  public onPlateNoSelect($event) {
    this.newMainData = [];
    this.SearchappendList = $event;
    this.listId = $event.id;
    this.billCode = $event.billCode;
    this.customerName = $event.customerName;
    this.suspendData = $event;
    this.service.getOrderItemData(this.listId)
      .then(data => {
        console.log(data)
        this.orderDetail = data
        this.serviceData = data.serviceOutputs;
        this.suspendData.serviceData = this.serviceData;
        this.productData = data.productOutputs;
        this.employeesData = data.maintenanceEmployees;
        // 去重
        var hash = {};
        this.InputData.employeesData = this.employeesData.reduce(function (item, next) {
          hash[next.name] ? '' : hash[next.name] = true && item.push(next);
          return item
        }, [])
      });

    // 根据工单号获取流水号列表
    this.service.getMainList(this.billCode).toPromise()
      .then(data => {
        this.serialData = data;
        this.serialData.sort((a, b) => {
          return a.serialNum - b.serialNum
        });
        this.suspendData.serialData = this.serialData;
        this.numberList = data.map(item => {
          return {
            value: item.serialNum,
            text: item.serialNum
          };
        });
        this.numberList.sort((a, b) => {
          return a.value - b.value
        });
        var hashNumber = {};
        this.numberPrintList = this.numberList.reduce(function (item, next) {
          hashNumber[next.text] ? '' : hashNumber[next.text] = true && item.push(next);
          return item
        }, [])

      })


  }
  numberList: any;
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
    maintenanceItemId: ""
  }

  // 点击发料弹出发料弹框
  OnCreatBound(item) {
    this.InputData.serviceName = item.serviceName; //维修项目名称
    this.InputData.maintenanceItemId = item.id; //维修明细id
    this.InputData = { ...this.InputData };
    this.createModal.show();
  }
  // 生成发料单
  private billReturnData: any;



  billData: any;
  OnCreatBill() {
    this.billData = {
      billCode: this.billCode,
      billId: this.listId,
      suspendedBillId: this.suspendedBillId,
      list: this.newMainData
    }
    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    console.log(this.billData);
    let postData = JSON.stringify(this.billData)
    console.log(postData);
    this.service.postBill(postData).then((result) => {
      el.disabled = false;
      this.suspendBill.refresh();
      this.alerter.info('生成发料单成功', true, 2000);
      this.isablePrint = true;
      this.billReturnData = result.data;
      this.serialData = this.serialData.concat(result.data);
      this.newMainData = [];
      console.log(result.data, this.serialData);

      this.serialData.sort((a, b) => {
        return a.serialNum - b.serialNum
      })

      this.numberList = this.serialData.map(item => {
        return {
          value: item.serialNum,
          text: item.serialNum
        };
      });
      this.numberList.sort((a, b) => {
        return a.value - b.value
      });
      var hashNumber = {};
      this.numberPrintList = this.numberList.reduce(function (item, next) {
        hashNumber[next.text] ? '' : hashNumber[next.text] = true && item.push(next);
        return item
      }, [])


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

  onCreate(evt) {
    console.log(evt);
    evt.amount = evt.amount * 100;
    if (this.newMainData) {
      this.newMainData = this.newMainData;
    } else {
      this.newMainData = []
    }
    this.newMainData.push(evt)
    this.suspendData.newMainData = this.newMainData;
    this.createModal.hide();
  }

  onDelCreat(i) {
    this.newMainData.splice(i, 1);
    this.suspendData.newMainData = this.newMainData;
  }
  SerialNumsList: any;

  printUrlData = {
    listId: "",
    billCode: "",
    SerialNumsList: []
  }
  onConfirmNumber(evt) {
    console.log(evt);
    this.SerialNumsList = evt.value;
    console.log(this.SerialNumsList)

    this.router.navigate(['./print', this.listId, this.billCode, this.SerialNumsList.join("-")], { relativeTo: this.route });
  }

  get columns() {
    return [
      { name: 'billCode', title: '工单号' },
      { name: 'customerName', title: '车主' },
      { name: 'plateNo', title: '车牌号' },
    ]
  }
  // 挂单数据
  private suspendData = {
    billCode: this.billCode,
    billId: this.listId,
    newMainData: this.newMainData,
    serviceData: this.serviceData,
    serialData: this.serialData,
    customerName: this.customerName,
  }
  private sunspendRequest: any;
  onSuspendSelect(item) {
    console.log(item)
    this.sunspendRequest = JSON.parse(item.data);
    this.billCode = this.sunspendRequest["billCode"]
    this.listId = this.sunspendRequest["id"];
    this.orderDetail = this.sunspendRequest;
    this.newMainData = this.sunspendRequest["newMainData"];
    this.serviceData = this.sunspendRequest["serviceData"];
    this.serialData = this.sunspendRequest["serialData"];
    this.employeesData = this.sunspendRequest["maintenanceEmployees"];
    // 去重
    var hash = {};
    this.InputData.employeesData = this.employeesData.reduce(function (item, next) {
      hash[next.name] ? '' : hash[next.name] = true && item.push(next);
      return item
    }, [])
    this.suspendedBillId = item.id;
  }

  suspend(event: Event) {


    if (this.sunspendRequest) {
      Object.assign(this.suspendData, this.sunspendRequest);
    }
    console.log(this.suspendData)
    if (!this.suspendData.billCode) {
      alert('请选择工单');
      return false;
    }

    let el = event.target as HTMLButtonElement;
    el.disabled = true;
    this.suspendBill.suspend(this.suspendData)
      .then(() => el.disabled = false)
      .then(() => this.suspendBill.refresh())
      .then(() => this.alerter.success('挂单成功！'))
      .catch(err => {
        el.disabled = false;
        this.alerter.error(err);
      })
  }



}
