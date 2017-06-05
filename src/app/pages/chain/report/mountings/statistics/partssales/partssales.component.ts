import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PrintDirective } from "app/shared/directives";
import { PartssalesService, PartssalesRequest } from "./partssales.service"
import { DataList } from "app/shared/models";
import { TreeviewItem, TreeviewConfig } from "ngx-treeview/lib";
import { OrderService } from "app/pages/chain/reception/order.service";
import { CentToYuanPipe, DurationHumanizePipe } from "app/shared/pipes";
import * as moment from 'moment';
@Component({
  selector: 'hq-partssales',
  templateUrl: './partssales.component.html',
  styleUrls: ['./partssales.component.css']
})
export class PartssalesComponent extends DataList<any> {
  private partssalesForm: FormGroup;
  params: PartssalesRequest;
  detail;
  detailItems;
  detailItemsLength: number;
  isLoading: boolean = false;


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
    protected service: PartssalesService,
    private formBuilder: FormBuilder,
    protected orderService: OrderService,
  ) {
    super(injector, service);
    this.createForm();
    this.params = new PartssalesRequest();
    // 获取可以选择的店名, 用于查询范围筛选
    this.orderService.getSelectableStores().subscribe(data => {
      console.log('采购统计门店数据', data);
      if (data[0].children && data[0].children.length > 0)
        this.items = data;
    });
  }


  @ViewChild('printer')
  public printer: PrintDirective;

  //打印
  print() {
    this.printer.print();
  }

  //模态框
  alert(ev, id, el, billCode, customerName) {
    ev.hqSpinner = true;
    this.service.get(id).then(data => {
      this.isLoading = true;
      this.detail = data[0];
      this.detail.billCode = billCode;
      this.detail.customerName = customerName;
      this.detailItemsLength = data.length;
      this.detailItems = data;
      console.log('详情数据', this.detail.items)
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

  //客戶名陳
  changeVal(e) {
    console.log('客戶名稱', e.target.value)
  }

  //搜索
  onSearch() {
    //将表单值赋给params
    Object.assign(this.params, this.partssalesForm.value);

    console.log('params', this.params);
    this.onLoadList();
  }

  //绑定表单
  createForm() {
    this.partssalesForm = this.formBuilder.group({
      searchStart: '',  //开始时间
      searchEnd: '',    // 结束时间
      name: '',         //供应商
      phone: '',         //供应商手机
    })
  }

  onSearchRangeChange(ev) {
    // 更新查询范围参数
    this.params.orgIds = ev;
  }

  joinOrderNumberOnSelect(ev) {
    this.partssalesForm.patchValue({
      billCode: ev.billCode,
    });
  }
  //时间控制
  public get maxEnterStartDate() {
    if (!this.partssalesForm.get('searchEnd').value) {
      return moment().format('YYYY-MM-DD');
    }
    return new Date(this.partssalesForm.get('searchEnd').value);
  }
  public get minEnterEndDate() {
    return new Date(this.partssalesForm.get('searchStart').value) || '';
  }
  public get maxEnterEndDate() {
    return moment().format('YYYY-MM-DD');
  }

}
