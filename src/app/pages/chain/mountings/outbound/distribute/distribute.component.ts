import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { DataList, PagedResult, StorageKeys, SelectOption } from "app/shared/models";
import { Router, ActivatedRoute } from "@angular/router";
import { DistributeService, DistributeRequest, SearchReturnData, ProductRequest } from "./distribute.service";
import { FormGroup, FormBuilder } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';
import { TypeaheadRequestParams, HqAlerter, PrintDirective, HqModalDirective } from 'app/shared/directives';
import * as moment from 'moment';
import { SuspendBillDirective } from "app/pages/chain/chain-shared";
import { DialogService } from "app/shared/services";

@Component({
  selector: 'hq-distribute',
  templateUrl: './distribute.component.html',
  styleUrls: ['./distribute.component.css'],
  providers: [DistributeService]
})
export class DistributeComponent implements OnInit {
  MRData: any = [];
  suspendedBillId: any;
  numberPrintList: SelectOption[];
  @ViewChild('createModal')
  private createModal: HqModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild(SuspendBillDirective)
  private suspendBill: SuspendBillDirective;
  @ViewChild('printer')
  public printer: PrintDirective;
  employeesData: any;
  maintenanceEmployees: any;
  isablePrint = false;
  printId: any;
  billCode: any;
  newMainData = [];
  productData: any;
  serviceData: any = [];
  listId: any;
  SearchappendList: any;
  ChooseOrderForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    injector: Injector,
    protected service: DistributeService,
    protected dialogService: DialogService,
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
      { name: 'vehicleName', title: '车型' }
    ];
  }

  // 选择之后根据id查找工单详情并替换数据
  initCreatName: any;
  initCreatId: any;
  customerName: any;
  serviceShow = false;
  serialShow = false;
  plateNo: string = "";
  public onPlateNoSelect($event) {
    this.serialShow = true;
    this.initDetailOrder();
    this.serviceShow = true;
    this.SearchappendList = $event;
    this.listId = $event.id;
    this.billCode = $event.billCode;
    this.customerName = $event.customerName;
    this.service.getOrderItemData(this.listId)
      .then(data => {
        this.serviceShow = false;
        this.orderDetail = data;
        this.plateNo = data.plateNo;
        this.customerName = data.customerName;
        this.serviceData = data.serviceOutputs;
        this.productData = data.productOutputs;
        this.serviceData.forEach(element => {
          if (element.maintenanceEmployees.length > 0) {
            element.isable = true;
          } else {
            element.isable = false;
          }
        });
      }).catch(err => { this.alerter.error(err), this.serviceShow = false });

    // 根据工单号获取已发料流水号列表
    this.service.getMMList(this.billCode).toPromise()
      .then(data => {
        this.serialShow = false;
        this.serialData = data;
        this.serialData.sort((a, b) => {
          return a.serialNum - b.serialNum
        });
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

      }).catch(err => { this.alerter.error(err), this.serialShow = false });

    // 根据工单号获取已退料流水号列表
    this.service.getMRList(this.billCode).toPromise()
      .then(data => {
        this.serialShow = false;
        this.MRData = data;
        this.MRData.sort((a, b) => {
          return a.serialNum - b.serialNum
        });
      }).catch(err => { this.alerter.error(err), this.serialShow = false });

  }
  numberList: any;
  serialData: any = [];
  serialDataList: any;
  // 车牌号工单号模糊搜索接口调用
  public get PlatNoSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new DistributeRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);

      this.service.getOrderPageData(p).then((result) => {
        if (result.data.length < 1) {
          this.alerter.error("找不到该工单或已完工，不能进行领料操作。", true, 5000);
        }
      }).catch((err) => this.alerter.error(err, true, 2000))

      return this.service.getOrderPageData(p);
    };
  }
  private newItem: any;
  private addNewItem = false;
  InputData = {
    serviceName: "",
    employeesData: "",
    maintenanceItemId: ""
  }

  // 点击发料弹出发料弹框
  item: any;
  OnCreatBound(item) {
    this.item = item;
    this.createModal.show();
    this.InputData.serviceName = item.serviceName; //维修项目名称
    this.InputData.maintenanceItemId = item.id; //维修明细id
    this.InputData.employeesData = item.maintenanceEmployees;
    this.InputData = { ...this.InputData };
  }
  // 生成发料单
  billData: any;
  generat = false;
  OnCreatBill() {
    this.generat = true;
    if (!this.listId) {
      this.alerter.error('工单id不能为空，请刷新重试', true, 3000);
      this.generat = false;
      return false;
    }

    this.billData = {
      billCode: this.billCode,
      billId: this.listId,
      suspendedBillId: this.suspendedBillId,
      list: this.newMainData
    }
    let el = event.target as HTMLButtonElement;
    // el.disabled = true;
    let postData = JSON.stringify(this.billData);
    this.service.postBill(postData).then((result) => {
      this.suspendBill.refresh();
      this.generat = false;
      this.dialogService.confirm({
        type: "question",
        text: '已生成维修领料单，是否需要打印？'
      }, () => {
        this.printList = null;
        this.service.getPrintList(this.listId, this.billCode, result.data[0].serialNum).toPromise()
          .then(data => {
            this.printList = data;
            setTimeout(() => { this.print() }, 1000);
          })
          .catch(err => { this.alerter.error(err, true, 2000); this.generat = false; })
      })


      this.isablePrint = true;
      let num = result.data[0].serialNum;
      this.serialData = this.serialData.concat(result.data);
      this.newMainData = [];
      this.serialData.sort((a, b) => {
        return a.serialNum - b.serialNum
      })

      this.numberList = this.serialData.map(item => {
        return {
          value: item.serialNum,
          text: item.serialNum,
          checked: item.serialNum === num,
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
    }).catch(err => { this.alerter.error(err, true, 2000); this.generat = false; });
  }

  hasList: any;
  onCreate(evt) {
    evt.price = evt.price;
    evt.amount = evt.amount;
    this.hasList = this.newMainData.filter(item => item.maintenanceItemId === evt.maintenanceItemId && item.productId === evt.productId);
    if (this.hasList.length > 0) {
      this.newMainData.forEach((item, index) => {
        if (item.maintenanceItemId === evt.maintenanceItemId && item.productId === evt.productId) {
          item.count = Number(evt.count);
          item.amount = Number(evt.amount);
          item.price = Number(evt.price);
        }
      })
    } else {
      this.newMainData.push(evt);
    }
    if (evt.isclose) {
      this.createModal.hide();
    }
  }

  onDelCreat(i) {
    this.dialogService.confirm({
      type: "warning",
      text: '是否确认删除该条领料信息？'
    }, () => {
      this.newMainData.splice(i, 1);
    })

  }
  SerialNumsList: any;

  printUrlData = {
    listId: "",
    billCode: "",
    SerialNumsList: []
  }
  printList: any;
  print() {
    this.printer.print();
  }
  onConfirmNumber(evt) {
    if (evt.value.length < 1) {
      this.alerter.error("请选择要打印的流水号", true, 3000);
      return false;
    }
    this.SerialNumsList = evt.value;
    this.printList = null;
    this.service.getPrintList(this.listId, this.billCode, this.SerialNumsList).toPromise()
      .then(data => {
        this.printList = data;
        console.log(this.printList)
        setTimeout(() => { this.print(); }, 1000);
      })
      .catch(err => { this.alerter.error(err, true, 2000) });
  }

  get columns() {
    return [
      { name: 'billCode', title: '工单号' },
      { name: 'customerName', title: '车主' },
      { name: 'plateNo', title: '车牌号' },
    ]
  }
  // 挂单数据
  private suspendData: any;
  private sunspendRequest: any;
  onSuspendSelect(item) {
    this.sunspendRequest = JSON.parse(item.data);
    this.billCode = this.sunspendRequest["billCode"]
    this.listId = this.sunspendRequest["billId"];
    this.orderDetail = this.sunspendRequest["orderDetail"];
    this.newMainData = this.sunspendRequest["newMainData"];
    this.serviceData = this.sunspendRequest["serviceData"];
    this.serialData = this.sunspendRequest["serialData"];
    this.employeesData = this.sunspendRequest["maintenanceEmployees"] || [];
    this.MRData = this.sunspendRequest["MRData"];
    this.suspendedBillId = item.id;
    // 去重
    var hash = {};
    this.InputData.employeesData = this.employeesData.reduce(function (item, next) {
      hash[next.name] ? '' : hash[next.name] = true && item.push(next);
      return item
    }, [])

  }
  suspend() {
    this.suspendData = {
      newMainData: this.newMainData,
      serviceData: this.serviceData,
      serialData: this.serialData,
      billCode: this.billCode,
      billId: this.listId,
      plateNo: this.plateNo,
      customerName: this.customerName,
      MRData: this.MRData,
      suspendedBillId: this.suspendedBillId,
      list: this.newMainData,
      orderDetail: this.orderDetail
    }

    if (this.sunspendRequest) {
      Object.assign(this.suspendData, this.sunspendRequest);
    }
    if (!this.suspendData.billCode) {
      this.alerter.error("请选择工单", true, 3000);
      return false;
    }
    this.suspendBill.suspend(this.suspendData)
      .then(() => { this.alerter.success('挂单成功！'); this.initDetailOrder(); this.initValue = ""; })
      .then(() => this.suspendBill.refresh())
      .catch(err => {
        this.alerter.error(err);
      })
  }
  private initValue: string = "";
  initDetailOrder() {
    this.sunspendRequest = [];
    this.billCode = "";
    this.listId = "";
    this.orderDetail = null;
    this.newMainData = [];
    this.serviceData = [];
    this.serialData = [];
    this.employeesData = [];
    this.MRData = [];
    this.suspendedBillId = "";
    this.suspendData = null;

  }
  createModalHide() {
    this.createModal.hide();
  }

}
