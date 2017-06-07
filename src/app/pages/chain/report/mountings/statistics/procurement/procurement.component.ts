import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PrintDirective } from "app/shared/directives";
import { ProcurementService, ProcurementRequest } from "./procurement.service"
import { DataList } from "app/shared/models";
import { TreeviewItem, TreeviewConfig } from "ngx-treeview/lib";
import { OrderService } from "app/pages/chain/reception/order.service";
import { CentToYuanPipe, DurationHumanizePipe } from "app/shared/pipes";
import * as moment from 'moment';

@Component({
  selector: 'hq-procurement',
  templateUrl: './procurement.component.html',
  styleUrls: ['./procurement.component.css']
})
export class ProcurementComponent extends DataList<any> {
  private procurementForm: FormGroup;
  params: ProcurementRequest;
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
    protected service: ProcurementService,
    private formBuilder: FormBuilder,
    protected orderService: OrderService,
  ) {
    super(injector, service);
    this.createForm();
    this.params = new ProcurementRequest();
    // 获取可以选择的店名, 用于查询范围筛选
    this.orderService.getSelectableStores().subscribe(data => {
      console.log('采购统计门店数据', data);
      if (data[0].children && data[0].children.length > 0)
        this.items = data;
    });
    // this.onSearch();
  }

  @ViewChild('printer')
  public printer: PrintDirective;

  //打印
  print() {
    this.printer.print();
  }

  //模态框
  alert(ev, id, el) {
    ev.hqSpinner = true;
    this.service.get(id).then(data => {
      this.isLoading = true;
      this.detail = data;
      this.detailItemsLength = data.items.length;
      this.detailItems = data.items;
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

  //搜索
  onSearch() {
    //将表单值赋给params
    Object.assign(this.params, this.procurementForm.value);
    this.params.searchEnd = this.procurementForm.get('searchEnd').value && this.procurementForm.get('searchEnd').value + 'T23:59:59.999';
    console.log('params', this.params);
    this.onLoadList();
  }

  //绑定表单
  createForm() {
    this.procurementForm = this.formBuilder.group({
      searchStart: moment().subtract(30, 'd').format('YYYY-MM-DD'), //开始时间
      searchEnd: moment().format('YYYY-MM-DD'), // 结束时间
      name: '', //供应商
    })
  }
  onProviderSelect(ev) {
    this.procurementForm.patchValue({
      name: ev.name
    });
  }
  onSearchRangeChange(ev) {
    // 更新查询范围参数
    this.params.orgIds = ev;
  }

  //时间控制
  public get maxEnterStartDate() {
    if (!this.procurementForm.get('searchEnd').value) {
      return new Date(moment().format('YYYY-MM-DD'));
    }
    return new Date(this.procurementForm.get('searchEnd').value);
  }
  public get minEnterEndDate() {
    return new Date(moment(this.procurementForm.get('searchStart').value).subtract(1, 'd').format('YYYY-MM-DD')) || '';
  }
  public get maxEnterEndDate() {
    return new Date(moment().format('YYYY-MM-DD'));
  }

}
