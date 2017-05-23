import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { DataList, StorageKeys, SelectOption } from "app/shared/models";
import { Router, ActivatedRoute } from "@angular/router";
import { MaintainReturnService, MaintainRequest } from "./maintain-return.service";
import { FormGroup, FormBuilder } from '@angular/forms';
import { TypeaheadRequestParams, HqAlerter, PrintDirective } from "app/shared/directives";
import { ModalDirective } from "ngx-bootstrap";
import { SuspendBillDirective } from "app/pages/chain/chain-shared";
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
  private createModal: ModalDirective;
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
    private fb: FormBuilder) {
    this.params = new MaintainRequest();
    // 构建表单
    this.createForm();
  }
  ngOnInit() {
  }

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
    this.serviceisShow = true;
    this.SearchappendList = $event;
    this.listId = $event.id;
    this.billCode = $event.billCode;
    this.suspendData = $event;
    this.service.getOrderItemData(this.listId)
      .then(data => {
        this.serviceisShow = false;
        this.orderDetail = data
        this.serviceData = data.serviceOutputs;
        this.productData = data.productOutputs;
      }).catch(err => { this.alerter.error(err), this.serviceisShow = false });

    this.service.getMMList(this.billCode).toPromise()
      .then(data => {
        this.serialData = data;
        this.suspendData.serialData = this.serialData;
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
        console.log(this.serialData)
      });
    this.newMainData = [];

    this.service.getMRList(this.billCode).toPromise()
      .then(data => {
        this.mrData = data;
        this.suspendData.mrData = this.mrData;
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
      });

  }
  print() {
    this.printer.print();
  }
  onConfirmNumber(evt) {
    console.log(evt);
    this.SerialNumsList = evt.value;
    console.log(this.SerialNumsList)
    this.service.getPrintList(this.listId, this.billCode, this.SerialNumsList).toPromise()
      .then(data => {
        console.log(data)
        this.printList = data;
        setTimeout(() => { this.print(); }, 200);
        setTimeout(() => { this.printList = null }, 400)
      })
      .catch(err => console.log(err));
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
  // // 是否取消退料
  // finishedOrder(evt, confirmModal) {
  //   evt.preventDefault();
  //   // 显示确认框
  //   confirmModal.show();
  // }
  // // 取消退料
  // onConfirmFinished(confirmModal) {
  //   confirmModal.hide();
  //   history.go(-1);
  // }

  private newMainData = [];

  private billData: any;
  private generat = false;
  //生成退料单
  showing = false;
  OnCreatReturnBill() {
    this.generat = true;
    this.billData = {
      billCode: this.billCode,
      billId: this.listId,
      OriginalBillId: this.OriginalBillId,
      suspendedBillId: this.suspendedBillId,
      list: this.newMainData
    }
    let postData = JSON.stringify(this.billData)
    console.log(postData);
    this.service.postReturnBill(postData).then((result) => {

      this.service.getMMList(this.billCode).toPromise()
        .then(data => {
          this.showing = false;
          this.serialData = data;
          this.suspendData.serialData = this.serialData;
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
          console.log(this.serialData)
        });
      this.newMainData = [];
      this.generat = false;
      console.log(result)
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
      if (confirm('生成退料单成功！ 是否打印？')) {
        this.service.getPrintList(this.listId, this.billCode, num).toPromise()
          .then(data => {
            console.log(data)
            this.printList = data;
            setTimeout(() => { this.print(); }, 200);
            setTimeout(() => { this.printList = null }, 400)
          })
          .catch(err => console.log(err));
      } else {

      }

      this.showing = true;



    }).catch(err => { this.alerter.error(err, true, 2000); this.showing = false; });
  }


  inputData: any;
  // 点击退料弹出弹框
  private iitem: any;
  OnCreatBound(ele, id) {
    console.log(ele, id);
    this.iitem = ele;
    ele.maintenanceItemId = ele.id; //维修明细id
    ele.curId = id;//记录点击的id
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

    // if ((this.item.count - this.item.returnCount) === 0) {
    //   this.item.isable = false;
    // }
    this.createModal.hide();
  }
  onDelCreat(e, i) {
    console.log(e, this.serialData);
    // this.serialData.find(item => item.id = e.curId).list.find(cur => cur.maintenanceItemId === e.maintenanceItemId).returnCount -= Number(e.count);
    this.newMainData.splice(i, 1);
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
    console.log(item)
    this.sunspendRequest = JSON.parse(item.data);
    this.billCode = this.sunspendRequest["billCode"]
    this.listId = this.sunspendRequest["id"];
    this.orderDetail = this.sunspendRequest;
    this.newMainData = this.sunspendRequest["newMainData"];
    this.serviceData = this.sunspendRequest["serviceData"];
    this.serialData = this.sunspendRequest["serialData"];
    this.suspendedBillId = item.id;
  }

  suspend(event: Event) {
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
      alert('请选择工单');
      return false;
    }

    // let el = event.target as HTMLButtonElement;
    // el.disabled = true;
    this.suspendBill.suspend(this.suspendData)
      // .then(() => el.disabled = false)
      .then(() => this.suspendBill.refresh())
      .then(() => this.alerter.success('挂单成功！'))
      .catch(err => {
        // el.disabled = false;
        this.alerter.error(err);
      })
  }
}
