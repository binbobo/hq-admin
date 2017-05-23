import { Component, OnInit, ViewChild, ViewChildren, QueryList, Injector } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { HqAlerter, PrintDirective, TypeaheadRequestParams, FormGroupControlErrorDirective } from "app/shared/directives";
import { SelectOption, PagedResult, DataList, PagedParams } from "app/shared/models";
import { InnerListRequest, InnerListItem, InnerReturnService, InnerPrintItem, BillCodeSearchRequest } from "../inner-return.service";
import { SuspendBillDirective } from "app/pages/chain/chain-shared";
import { FormGroup, FormBuilder } from "@angular/forms/";

@Component({
  selector: 'hq-return-list',
  templateUrl: './return-list.component.html',
  styleUrls: ['./return-list.component.css']
})
export class ReturnListComponent extends DataList<any> {

  // private takeUserId: any;//领用人
  private takeUser: any;//领用人ID
  private returnUser: any;//退料人
  private returnDepart: any;//退料人
  private takeDepartId: any;//查部门ID
  private selectReturnData: any;//选择的退料数据
  private returnData = [];//修改后的退料数据
  // private billCodeList: any;//
  private billCode: any;//退料单号
  private suspendData: any;//挂单数据
  private suspendSelectData: any;//选择挂单数据
  private suspendedBillId: any;//挂单id
  private innerReturner: any;//挂单列表
  private innerDepartment: any;//挂单列表
  private originalBillId: any;
  private billData;//生成退料单数据
  params: BillCodeSearchRequest;


  private form: FormGroup;
  @ViewChildren(FormGroupControlErrorDirective)
  private controls: QueryList<FormGroupControlErrorDirective>;

  @ViewChild(SuspendBillDirective)
  private suspendBill: SuspendBillDirective;
  @ViewChild('createModel')
  private createModel: ModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild('printer')
  public printer: PrintDirective;
  private employees: any;
  private departments: any;
  private model;//配件信息
  private printModel: any;

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private innerReturnService: InnerReturnService,
  ) {
    super(injector, innerReturnService);
    this.params = new BillCodeSearchRequest();
    this.size = 5;
  }


  ngOnInit() {
    this.innerReturnService.getInnerOptions()
      .then(data => {
        // console.log('领用人数据', data);
        this.takeUser = data[0].takeUser;
        // console.log('初始化ID', this.takeUser);
        this.employees = data;
        this.departments = this.employees.find(m => m.takeUser == this.takeUser);
        this.takeDepartId = this.departments.departList[0].id;
        // console.log('部门数据', this.departments, this.takeDepartId);
      })
      .catch(err => this.alerter.error(err));
    this.lazyLoad = true;
    super.ngOnInit();
  }



  //选择领用人带出所在部门
  onInnerSelect(event: Event) {
    let el = event.target as HTMLSelectElement;
    this.takeDepartId = null;
    this.takeUser = null;
    this.departments = null;
    this.takeUser = el.value;
    // console.log('选择领用人ID', this.takeUser);
    this.departments = this.employees.find(m => m.takeUser == this.takeUser);
    this.takeDepartId = this.departments.departList[0].id;
    // console.log('选择部门', this.departments, this.takeDepartId);
    this.billCode = null;
    this.list = null;
    this.originalBillId = null;
    this.returnData = [];
  }

  //选择部门
  onDepartSelect(event: Event) {
    let el = event.target as HTMLSelectElement;
    console.log('选择部门ID', el.value);
    this.takeDepartId = el.value;
  }

  //生成退料单
  createReturnList() {
    let inner = this.employees.find(m => m.takeUser == this.takeUser);
    let department = this.departments.departList.find(m => m.id == this.takeDepartId);
    this.returnUser = inner && inner.takeUserName;
    this.billData = {
      originalBillId: this.originalBillId,
      suspendedBillId: this.suspendedBillId,
      billCode: this.billCode,
      returnUser: this.takeUser,
      returnDepart: this.takeDepartId,
      list: this.returnData,
    }
    console.log('生成的退料单数据', JSON.stringify(this.billData));
    this.innerReturnService.createReturnList(this.billData)
      .then(data => {
        console.log('即将打印的数据', data);
        return confirm('已生成退料单，是否需要打印？') ? data : null;
      })
      .then(code => code && this.innerReturnService.get(code))
      .then(data => {
        if (data) {
          this.printModel = data;
          console.log('传递到打印页面的数据', this.printModel);
          setTimeout(() => this.printer.print(), 300);
        }
      })
      .then(() => {
        this.returnData = [];
        this.list = null;
        this.billCode = null;
        // this.printModel = null;
      })
      .catch(err => {
        this.alerter.error(err);
      })
  }

  //取消
  // cancel() {
  //   let conf = confirm('你确定需要取消退料吗？');
  //   if (conf) {
  //     history.go(-1);
  //   }
  // }
  //挂单
  suspend() {
    if (confirm('是否确认挂单？')) {
      // let el = event.target as HTMLButtonElement;
      // el.disabled = true;
      let inner = this.employees.find(m => m.takeUser == this.takeUser);
      let department = this.departments.departList.find(m => m.id == this.takeDepartId);
      this.innerReturner = inner && inner.takeUserName;
      this.innerDepartment = department && department.name;
      this.suspendData = {
        model: this.list,
        returnData: this.returnData,
        billCode: this.billCode,
        takeUserId: this.takeUser,
        takeDepartId: this.takeDepartId,
        suspendedBillId: this.suspendedBillId,
        innerReturner: this.innerReturner,
        innerDepartment: this.innerDepartment,
        originalBillId: this.originalBillId,
      }
      console.log(this.suspendData);
      this.suspendBill.suspend(this.suspendData)
        // .then(() => el.disabled = false)
        .then(() => this.suspendBill.refresh())
        .then(() => {
          this.returnData = [];
          this.list = null;
          this.billCode = null;
          this.originalBillId = null;
          // this.takeUser = this.employees[0].value;
        })
        // .then(() => this.reset())
        .then(() => this.alerter.success('挂单成功！'))
        .catch(err => {
          // el.disabled = false;
          this.alerter.error(err);
        })
    }
  }
  historyData: any;
  //退料提交
  onCreate(e) {
    console.log('返回数据', e);
    e.price = parseInt(e.price) * 100;
    e.amount = parseInt(e.amount) * 100;
    this.historyData = this.returnData.filter(item => item.originalId == e.originalId)
    if (this.historyData.length > 0) {
      this.returnData.forEach((item, index) => {
        if (item.originalId == e.originalId) {
          item.count = Number(e.count);
          item.amount = Number(e.amount);
          item.existCounts = Number(e.existCounts);
        }
      })
    } else {
      this.returnData.push(e);
    }
    this.createModel.hide();
  }

  //删除退料信息
  onDelCreat(e, i) {
    if (confirm('是否确认删除该条退料信息！'))
      this.returnData.splice(i, 1);
  }

  //选择挂单信息
  onSuspendSelect(item) {
    console.log('选择的挂单数据', item);
    // this.reset();
    // Object.assign(this.model, item.value);
    this.suspendedBillId = item.id;
    this.originalBillId = item.value.originalBillId;
    console.log(item.value.originalBillId);
    this.billCode = item.value.billCode;
    this.takeUser = item.value.takeUserId;
    this.list = item.value.model;
    this.returnData = item.value.returnData;
  }
  // reset() {
  //   this.model = new InnerListRequest();
  //   this.returnData = [];
  //   if (Array.isArray(this.employees) && this.employees.length) {
  //     this.model.returnUser = this.employees[0].value;
  //   }
  //   if (Array.isArray(this.departments) && this.departments.length) {
  //     this.model.returnDepart = this.departments[0].value;
  //   }
  // }
  //挂单列表
  get innerColumns() {
    return [
      { name: 'innerReturner', title: '领料人' },
      { name: 'innerDepartment', title: '领用部门' },
    ]
  }

  //领用单号列表
  public get itemColumns() {
    return [
      { name: 'text', title: '内部领用单号' },
    ];
  }
  //模糊查询单号
  public get codeSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new BillCodeSearchRequest(this.takeUser, this.takeDepartId, params.text);
      p.setPage(params.pageIndex, params.pageSize);
      // console.log('ppppppppp',p);
      return this.innerReturnService.getCodePagedList(p)
    };
  }


  //选择单号带出配件信息
  onItemSelect(event) {
    this.billCode = event.text;
    this.originalBillId = event.value;
    console.log('iiiiiiii', event);
    this.returnData = [];
    this.params.takeUserId = this.takeUser;
    this.params.takeDepartId = this.takeDepartId;
    this.params.billCode = this.billCode;
    this.onLoadList();
    // let item = new BillCodeSearchRequest(this.takeUser, this.takeDepartId, this.billCode);
    // this.innerReturnService.getPagedList(item)
    //   .then(data => {
    //     console.log('iiiiii配件信息', data);
    //     this.model = data.data;

    //   })
    //   .catch(err => Promise.reject(`获取配件信息失败：${err}`));
  }

  //退料显示弹框
  OnCreatBound(data, id) {
    console.log('弹框数据', data);
    this.selectReturnData = [];
    //  this.originalBillId = data.id;
    console.log('原始领用', this.originalBillId);
    // this.selectReturnData = data;
    Object.assign(this.selectReturnData, data);
    this.selectReturnData.price = (parseFloat(this.selectReturnData.price) / 100).toFixed(2);
    this.selectReturnData.amount = (parseFloat(this.selectReturnData.amount) / 100).toFixed(2);
    this.selectReturnData.counts = 1;
    // console.log('修改后弹框数据',this.selectReturnData);
    this.createModel.show();
  }

}
