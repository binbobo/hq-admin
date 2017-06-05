import { Component, OnInit, ViewChild, Injector, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PrintDirective } from "app/shared/directives";
import { ReceiveService, ReceiveRequest } from "./receive.service"
import { DataList, SelectOption } from "app/shared/models";
import { TreeviewItem, TreeviewConfig } from "ngx-treeview/lib";
import { OrderService } from "app/pages/chain/reception/order.service";
import { CentToYuanPipe, DurationHumanizePipe } from "app/shared/pipes";
import * as moment from 'moment';

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

  // 用于ngx-treeview组件
  public items: TreeviewItem[];
  public config: TreeviewConfig = {
    isShowAllCheckBox: false,
    isShowFilter: false,
    isShowCollapseExpand: false,
    maxHeight: 500
  };

  constructor(
    injector: Injector,
    protected service: ReceiveService,
    private formBuilder: FormBuilder,
    protected orderService: OrderService,
  ) {
    super(injector, service);
    this.createForm();
    this.params = new ReceiveRequest();
    // 获取可以选择的店名, 用于查询范围筛选
    this.orderService.getSelectableStores().subscribe(data => {
      console.log('内部领用门店数据', data);
      if (data[0].children && data[0].children.length > 0)
        this.items = data;
    });
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
        takeUser:this.employees[0].value
      })
    }
    if (Array.isArray(this.departments) && this.departments.length) {
      this.receiveForm.patchValue({
        takeDepart:this.departments[0].value
      })
    }
  }

  onReceiverSelect(event: Event) {
    let el = event.target as HTMLSelectElement;
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
  alert(ev, id, el, billCode, takeUserName, takeDepartmentName, createBillTime, operator) {
    ev.hqSpinner = true;
    this.service.get(id).then(data => {
      this.isLoading = true;
      console.log('详情数据', this.detail)
      this.detail = data[0];
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

    console.log('params', this.params);
    this.onLoadList();
  }

  //绑定表单
  createForm() {
    this.receiveForm = this.formBuilder.group({
      takeUser: '',//领用人
      takeDepart: '',//部门
      searchStart: '', //开始时间
      searchEnd: '', // 结束时间
    })
  }

  onSearchRangeChange(ev) {
    // 更新查询范围参数
    this.params.orgIds = ev;
  }

  joinOrderNumberOnSelect(ev) {
    this.receiveForm.patchValue({
      billCode: ev.billCode,
    });
  }

  //时间控制
  public get maxEnterStartDate() {
    if(!this.receiveForm.get('searchEnd').value){
      return moment().format('YYYY-MM-DD');
    }
    return new Date(this.receiveForm.get('searchEnd').value);
  }
  public get minEnterEndDate() {
    return new Date(this.receiveForm.get('searchStart').value) || '';
  }
  public get maxEnterEndDate() {
    return moment().format('YYYY-MM-DD');
  }
}
