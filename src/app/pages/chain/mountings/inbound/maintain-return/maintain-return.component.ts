import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { DataList, StorageKeys, SelectOption } from "app/shared/models";
import { Router, ActivatedRoute } from "@angular/router";
import { MaintainReturnService, MaintainRequest } from "./maintain-return.service";
import { FormGroup, FormBuilder } from '@angular/forms';
import { TypeaheadRequestParams, HqAlerter, PrintDirective, HqModalDirective } from 'app/shared/directives';
import { SuspendBillDirective } from "app/pages/chain/chain-shared";
import { DialogService } from "app/shared/services";
@Component({
  selector: 'app-maintain-return',
  templateUrl: './maintain-return.component.html',
  styleUrls: ['./maintain-return.component.css']
})
export class MaintainReturnComponent implements OnInit {
  [name: string]: any;
  numberList: SelectOption[];
  mrData: any = [];
  suspendedBillId: any;
  serialData: any = [];
  @ViewChild('createModal')
  private createModal: HqModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild(SuspendBillDirective)
  private suspendBill: SuspendBillDirective;
  @ViewChild('printer')
  public printer: PrintDirective;
  billCode: any;
  printId: any;
  productData: any;
  serviceData: any = [];
  listId: any;
  SearchappendList: any;
  private newItem: any;
  ChooseOrderForm: FormGroup;
  private addNewItem = false;
  params: MaintainRequest;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    injector: Injector,
    protected service: MaintainReturnService,
    protected dialogService: DialogService,
    private fb: FormBuilder) {
    this.params = new MaintainRequest();
    // 构建表单
    this.createForm();

  }
  ngOnInit() { }

  private orderDetail: any;
  public get typeaheadColumns() {
    return [
      { name: 'plateNo', title: '车牌号' },
      { name: 'billCode', title: '工单号' },
      { name: 'customerName', title: '车主' },
      { name: 'brand', title: '品牌' },
      { name: 'vehicleName', title: '车型' }
    ];
  }
  suspendData: any;
  // 选择之后根据id查找工单详情并替换数据
  serviceisShow = false;
  public onPlateNoSelect($event) {
    this.initDetailData();
    this.serviceisShow = true;
    this.serialDataShow = true;
    this.SearchappendList = $event;
    this.listId = $event.id;
    this.billCode = $event.billCode;
    this.service.getOrderItemData(this.listId)
      .then(data => {
        this.serviceisShow = false;
        this.orderDetail = data;
        this.serviceData = data.serviceOutputs;
        this.productData = data.productOutputs;
      }).catch(err => { this.alerter.error(err), this.serviceisShow = false });

    this.service.getMMList(this.billCode).toPromise()
      .then(data => {
        this.serialDataShow = false;
        this.serialData = data;
        this.serialData.sort((a, b) => {
          return a.serialNum - b.serialNum;
        })
        this.serialData.forEach(element => {
          (element.list).forEach(ele => {
            if ((ele.count - ele.returnCount) > 0) {
              element.isable = true;
            } else {
              element.isable = false;
            }
            ele.curId = element.id;
          })
        });
      }).catch(err => { this.alerter.error(err); this.serialDataShow = false; });

    this.service.getMRList(this.billCode).toPromise()
      .then(data => {
        this.mrData = data;
        this.mrData.sort((a, b) => {
          return a.serialNum - b.serialNum;
        });

        this.numberList = data.map(item => {
          return {
            value: item.serialNum,
            text: item.serialNum
          };
        });

        var hashNumber = {};
        this.numberPrintList = this.numberList.reduce(function (item, next) {
          hashNumber[next.text] ? '' : hashNumber[next.text] = true && item.push(next);
          return item
        }, [])

        this.numberPrintList.sort((a, b) => {
          return a.value - b.value
        });
      }).catch(err => { this.alerter.error(err) });;

  }
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
        setTimeout(() => { this.print(); }, 1000);
      })
      .catch(err => { this.alerter.error(err) });
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
  private newMainData = [];
  private billData: any;
  private generat = false;
  //生成退料单
  OnCreatReturnBill() {
    this.generat = true;
    this.billData = {
      billCode: this.billCode,
      billId: this.listId,
      OriginalBillId: this.OriginalBillId,
      suspendedBillId: this.suspendedBillId,
      list: this.newMainData
    }
    let postData = JSON.stringify(this.billData);
    this.service.postReturnBill(postData).then((result) => {
      this.generat = false;
      this.serialDataShow = true;
      this.suspendBill.refresh();
      this.service.getMMList(this.billCode).toPromise()
        .then(data => {
          this.serialDataShow = false;
          this.serialData = data;
          this.serialData.sort((a, b) => {
            return a.serialNum - b.serialNum;
          })
          this.serialData.forEach(element => {
            (element.list).forEach(ele => {
              if ((ele.count - ele.returnCount) > 0) {
                element.isable = true;
              } else {
                element.isable = false;
              }
              ele.curId = element.id;
            })

          });
        }).catch(err => { this.alerter.error(err); this.serialDataShow = false; });
      this.newMainData = [];
      this.generat = false;
      let num = result.data[0].serialNum;
      this.newMainData = [];
      this.mrData = this.mrData.concat(result.data);

      this.mrData.sort((a, b) => {
        return a.serialNum - b.serialNum
      })

      this.numberList = this.mrData.map(item => {
        return {
          value: item.serialNum,
          text: item.serialNum,
          checked: item.serialNum === num
        };
      });

      var hashNumber = {};
      this.numberPrintList = this.numberList.reduce(function (item, next) {
        hashNumber[next.text] ? '' : hashNumber[next.text] = true && item.push(next);
        return item
      }, [])
      this.numberPrintList.sort((a, b) => {
        return a.value - b.value
      });
      this.printList = null;
      this.dialogService.confirm({
        type: "question",
        text: '已生成维修退料单，是否需要打印？'
      },() => {
        
        this.service.getPrintList(this.listId, this.billCode, num).toPromise()
          .then(data => {
            this.printList = data;
            setTimeout(() => { this.print(); }, 1000);
          })
          .catch(err => { this.alerter.error(err); this.generat = false })
      })
    }).catch(err => { this.alerter.error(err); this.generat = false });
  }


  inputData: any;
  // 点击退料弹出弹框
  OnCreatBound(ele, item, id) {
    ele.serialNum = item.serialNum;
    ele.maintenanceItemId = ele.maintenanceItemId; //维修明细id
    ele.curId = id;//记录点击的id
    ele.originalId = ele.id;//原始单id
    this.OriginalBillId = id;
    this.inputData = ele;
    this.createModal.show();
  }
  hasList: any;
  onCreate(e) {
    // this.item.returnCount += Number(e.count);
    this.hasList = this.newMainData.filter(item => item.curId === e.curId && item.maintenanceItemId === e.maintenanceItemId);
    if (this.hasList.length > 0) {
      this.newMainData.forEach((item, index) => {
        if (item.curId === e.curId && item.maintenanceItemId === e.maintenanceItemId) {
          item.count = Number(e.count);
          item.amount = Number(e.amount);
        }
      })
    } else {
      this.newMainData.push(e);
    }
    this.createModal.hide();
  }
  onDelCreat(e, i) {
    // this.serialData.find(item => item.id = e.curId).list.find(cur => cur.maintenanceItemId === e.maintenanceItemId).returnCount -= Number(e.count);
    this.dialogService.confirm({
      type: "warning",
      text: '是否确认删除该条退料信息？'
    },() => {
      this.newMainData.splice(i, 1);
    })

  }
  get columns() {
    return [
      { name: 'billCode', title: '工单号' },
      { name: 'customerName', title: '车主' },
      { name: 'plateNo', title: '车牌号' },
    ]
  }
  private sunspendRequest: any;
  onSuspendSelect(item) {
    this.sunspendRequest = JSON.parse(item.data);
    this.billCode = this.sunspendRequest["billCode"]
    this.listId = this.sunspendRequest["billId"];
    this.orderDetail = this.sunspendRequest;
    this.newMainData = this.sunspendRequest["newMainData"];
    this.serviceData = this.sunspendRequest["serviceData"];
    this.serialData = this.sunspendRequest["serialData"];
    this.suspendedBillId = item.id;
  }
  initDetailData() {
    this.sunspendRequest = null;
    this.billCode = "";
    this.listId = "";
    this.orderDetail = null;
    this.newMainData = [];
    this.serviceData = [];
    this.serialData = [];
    this.mrData = [];
    this.suspendedBillId = "";
    this.suspendData = "";
  }
  suspend() {
    this.suspendData = {
      newMainData: this.newMainData,
      serviceData: this.serviceData,
      serialData: this.serialData,
      billCode: this.billCode,
      OriginalBillId: this.OriginalBillId,
      billId: this.listId,
      suspendedBillId: this.suspendedBillId,
      list: this.newMainData
    }
    Object.assign(this.suspendData, this.orderDetail)
    if (this.sunspendRequest) {
      Object.assign(this.suspendData, this.sunspendRequest);
    }
    if (!this.suspendData.billCode) {
      this.alerter.error("请选择工单",true,3000);
      return false;
    }
    this.suspendBill.suspend(this.suspendData)
      .then(() => { this.alerter.success('挂单成功！'); this.initDetailData(); this.initValue = "" })
      .then(() => this.suspendBill.refresh())
      .catch(err => {
        this.alerter.error(err);
      })
  }
}
