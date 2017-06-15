import { Component, OnInit, ViewChild, Injector, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PrintDirective } from "app/shared/directives";
import { ReceiveService, ReceiveRequest } from "./receive.service"
import { DataList, SelectOption } from "app/shared/models";
import { TreeviewItem, TreeviewConfig } from "ngx-treeview/lib";
import { CentToYuanPipe, DurationHumanizePipe } from "app/shared/pipes";
import * as moment from 'moment';
import { TotalValueService } from "app/pages/chain/report/total-value/total-value.service";

@Component({
  selector: 'hq-inner-receive',
  templateUrl: './inner-receive.component.html',
  styleUrls: ['./inner-receive.component.css']
})
export class InnerReceiveComponent extends DataList<any> {
  private receiveForm: FormGroup;
  params: ReceiveRequest;
  detail;
  detailItems;
  detailItemsLength: number;
  isLoading: boolean = false;
  private employees: Array<SelectOption>;
  private departments: Array<SelectOption>;
  private stations: Array<any>;
  private orgShow = false;
  private orgNameShow=false;
  constructor(
    injector: Injector,
    protected service: ReceiveService,
    private formBuilder: FormBuilder,
    protected totalValueService: TotalValueService,
  ) {
    super(injector, service);
    this.createForm();
    this.params = new ReceiveRequest();
    // 获取可以选择的店名, 用于查询范围筛选
    this.totalValueService.getStationTreeView()
      .then(data => {
        this.stations = data;
        if (this.stations.length > 1 || this.stations.find(m => m.children.length > 0))
          this.orgShow = true;
      })
      .catch(err => this.alerter.error(err));

    this.service.getReceiverOptions()
      .then(data => {
        this.employees = data;
        this.loadDepartments(data[0].value);
      })
      // .then(data => data.length && this.loadDepartments(data[0].value))
      .then(data => this.reset())
      .catch(err => this.alerter.error(err));
  }

  reset() {
    if (Array.isArray(this.employees) && this.employees.length) {
      this.receiveForm.patchValue({
        takeUser: this.employees[0].value
      })
    }
    if (Array.isArray(this.departments) && this.departments.length) {
      this.receiveForm.patchValue({
        takeDepart: this.departments[0].value
      })
    }
  }

  onReceiverSelect(event: Event) {
    let el = event.target as HTMLSelectElement;
    console.log(event);
    this.loadDepartments(el.value);
  }
  private loadDepartments(id: string) {
    this.departments = [];
    this.service.getDepartmentsByReceiver(id)
      .then(options => this.departments = options)
      .then(() => {
        if (Array.isArray(this.departments) && this.departments.length) {
          this.receiveForm.patchValue({
            takeDepart: this.departments[0].value,
          })
        }
      })
      .catch(err => this.alerter.error(err));
  }


  @ViewChild('printer')
  public printer: PrintDirective;

  //打印
  print() {
    this.printer.print();
  }

  //模态框
  alert(ev, id, el, billCode, takeUserName, takeDepartmentName, createBillTime, operator,isOut) {
    ev.hqSpinner = true;
    this.service.get(`${id}&isOut=${isOut}`).then(data => {
      this.isLoading = true;
      console.log('详情数据detail', data)
      this.detail = data[0]||{};
      this.detail.billCode = billCode;
      this.detail.takeUserName = takeUserName;
      this.detail.takeDepartmentName = takeDepartmentName;
      this.detail.createBillTime = createBillTime;
      this.detail.operator = operator;
      this.detailItemsLength = data.length;
      this.detailItems = data;
      el.show()
      ev.hqSpinner = false;
    }).catch(err => {
      this.alerter.error(err, true, 2000);
      ev.hqSpinner = false;
    })
  }

  //导出
  onExport() {
    this.service.export(this.params).then(() => {
      console.log('导出成功！', this.params);
    });
  }

  //搜索
  onSearch() {
    //将表单值赋给params
    Object.assign(this.params, this.receiveForm.value);
    this.params.searchEnd = this.receiveForm.get('searchEnd').value && this.receiveForm.get('searchEnd').value + 'T23:59:59.999';
    console.log('params', this.params);
    this.orgNameShow=false;
    this.onLoadList();
    if(this.params.orgIds&&this.params.orgIds.length>1){
      this.orgNameShow=true;
    }
  }

  //绑定表单
  createForm() {
    this.receiveForm = this.formBuilder.group({
      takeUser: '',//领用人
      takeDepart: '',//部门
      searchStart: moment().subtract(30, 'd').format('YYYY-MM-DD'), //开始时间
      searchEnd: moment().format('YYYY-MM-DD'), // 结束时间
    })
  }

  onSearchRangeChange(ev) {
    // 更新查询范围参数
    let orgIdsArr: Array<any> = [];
    ev.map(m => {
      orgIdsArr.push(m.value)
    })
    this.params.orgIds = orgIdsArr;
    console.log('查询范围', ev, this.params.orgIds);
  }

  joinOrderNumberOnSelect(ev) {
    this.receiveForm.patchValue({
      billCode: ev.billCode,
    });
  }

  //时间控制
  public get maxEnterStartDate() {
    if (!this.receiveForm.get('searchEnd').value) {
      return new Date(moment().format('YYYY-MM-DD'));
    }
    return new Date(this.receiveForm.get('searchEnd').value);
  }
  public get minEnterEndDate() {
    return new Date(moment(this.receiveForm.get('searchStart').value).subtract(1, 'd').format('YYYY-MM-DD')) || '';
  }
  public get maxEnterEndDate() {
    return new Date(moment().format('YYYY-MM-DD'));
  }
}
