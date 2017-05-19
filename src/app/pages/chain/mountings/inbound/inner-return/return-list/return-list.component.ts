import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from "ngx-bootstrap";
import { HqAlerter, PrintDirective, TypeaheadRequestParams } from "app/shared/directives";
import { SelectOption, PagedResult } from "app/shared/models";
import { InnerListRequest, InnerListItem, InnerReturnService, InnerPrintItem, BillCodeSearchRequest } from "../inner-return.service";
import { SuspendBillDirective } from "app/pages/chain/chain-shared";

@Component({
  selector: 'hq-return-list',
  templateUrl: './return-list.component.html',
  styleUrls: ['./return-list.component.css']
})
export class ReturnListComponent implements OnInit {

  private takeUserId:any;//查询参数
  private takeDepartId:any;//查询参数
  private selectReturnData:any;//退料数据
  private returnData = [];//修改后的退料数据
  private billCode:any;//退料单号
  private suspendData:any;//挂单数据

  @ViewChild(SuspendBillDirective)
  private suspendBill: SuspendBillDirective;
  @ViewChild('createModel')
  private createModel: ModalDirective;
  @ViewChild(HqAlerter)
  protected alerter: HqAlerter;
  @ViewChild('printer')
  public printer: PrintDirective;
  private employees: Array<SelectOption>;
  private departments: Array<SelectOption>;
  private model;//配件信息
  private printModel: InnerPrintItem;

  constructor(
    private innerReturnService: InnerReturnService,
  ) { }


  ngOnInit() {
    this.innerReturnService.getInnerOptions()
      .then(data => {
        console.log('领用人数据',data);
        return this.employees = data})
      .then(data => data.length && this.loadDepartments(data[0].value))
      // .then(data => this.reset())
      .catch(err => this.alerter.error(err));
  }
//选择领用人带出所在部门
  onInnerSelect(event: Event) {
    let el = event.target as HTMLSelectElement;
    console.log('选择领用人',el.value);
    this.loadDepartments(el.value);
  }

//生成退料单
  // createReturnList(event: Event) {
  //   let el = event.target as HTMLButtonElement;
  //   el.disabled = true;
  //   // console.log(this.model);
  //   this.innerReturnService.createReturnList(this.model)
  //     .then(data => {
  //       el.disabled = false;
  //       this.reset();
  //       // console.log(data);
  //       return confirm('已生成退料单，是否需要打印？') ? data : null;
  //     })
  //     .then(code => code && this.innerReturnService.get(code))
  //     .then(data => {
  //       if (data) {
  //         this.printModel = data;
  //         // console.log(this.printModel);
  //         setTimeout(() => this.printer.print(), 300);
  //       }
  //     })
  //     .catch(err => {
  //       el.disabled = false;
  //       this.alerter.error(err);
  //     })
  // }

//取消
  cancel() {
    let conf = confirm('你确定需要取消退料吗？');
    if (conf) {
      history.go(-1);
    }
  }
  //挂单
  // suspend() {
  //   if (confirm('是否确认挂单？')) {
  //     // let el = event.target as HTMLButtonElement;
  //     // el.disabled = true;
  //     let inner = this.employees.find(m => m.value == this.model.returnUser);
  //     let department = this.departments.find(m => m.value == this.model.returnDepart);
  //     this.model['innerReturner'] = inner && inner.text;
  //     this.model['department'] = department && department.text;
  //     this.suspendData = {
  //       model:this.model,
  //       returnData:this.returnData,
  //       billCode:this.billCode,
  //     }
  //     console.log(this.suspendData);
  //     this.suspendBill.suspend(this.suspendData)
  //       // .then(() => el.disabled = false)
  //       .then(() => this.suspendBill.refresh())
  //       .then(() => this.reset())
  //       .then(() => this.alerter.success('挂单成功！'))
  //       .catch(err => {
  //         // el.disabled = false;
  //         this.alerter.error(err);
  //       })
  //   }
  // }
//退料提交
  onCreate(e) {
    console.log('返回数据',e);
    this.returnData=[];
    this.returnData.push(e);
    this.createModel.hide();
  }

  private loadDepartments(id: string) {
    this.departments = [];
    this.takeUserId = id;
    this.innerReturnService.getDepartmentsByInner(id)
      .then(options => {
        console.log('部门数据',options);
        this.departments = options;
      this.takeDepartId = options[0].value})
      // .then(options => this.reset())
      .catch(err => this.alerter.error(err));
    // console.log('领用人ID',this.takePartId,this.takeUserId);
  }

//选择挂单信息
  // onSuspendSelect(item) {
  //   console.log('选择的挂单数据',item);
  //   this.reset();
  //   // Object.assign(this.model, item.value);

  //   this.model.suspendedBillId = item.id;
  // }
  reset() {
    this.model = new InnerListRequest();
    this.returnData = [];
    if (Array.isArray(this.employees) && this.employees.length) {
      this.model.returnUser = this.employees[0].value;
    }
    if (Array.isArray(this.departments) && this.departments.length) {
      this.model.returnDepart = this.departments[0].value;
    }
  }
  //挂单列表
  get innerColumns() {
    return [
      { name: 'innerReturner', title: '领料人' },
      { name: 'department', title: '领用部门' },
    ]
  }

  //领用单号列表
  public itemColumns() {
    return [
      { name: 'billCode', title: '内部领用单号' },
    ];
  }
  //模糊查询单号
  public get codeSource() {
    return (params: TypeaheadRequestParams) => {
      let p = new BillCodeSearchRequest(this.takeUserId,this.takeDepartId,params.text);
      p.setPage(params.pageIndex, params.pageSize);
      // console.log('ppppppppp',p);
      return this.innerReturnService.getPagedList(p);
    };
  }

//选择单号带出配件信息
  onItemSelect(event){
    this.billCode = event.billCode;
    this.returnData = [];
    let item = new BillCodeSearchRequest(this.takeUserId,this.takeDepartId,this.billCode);
      // console.log('iiiiiiii',item);
      this.innerReturnService.getUseDetailsList(item)
      .then(data =>{
        console.log('iiiiii配件信息',data);
        this.model = data.data;
      })
      .catch(err => Promise.reject(`获取配件信息失败：${err}`));
  }

  //退料显示弹框
  OnCreatBound(data,id){
    console.log('弹框数据',data);
    this.selectReturnData = [];
    // this.selectReturnData = data;
    Object.assign(this.selectReturnData,data);
    this.selectReturnData.price = (parseFloat(this.selectReturnData.price)/100).toFixed(2);
    this.selectReturnData.amount = (parseFloat(this.selectReturnData.amount)/100).toFixed(2);
    // console.log('修改后弹框数据',this.selectReturnData);
    this.createModel.show();
  }

//删除退料信息
  onDelCreat(i){
    this.returnData.splice(i,1);
  }

}
