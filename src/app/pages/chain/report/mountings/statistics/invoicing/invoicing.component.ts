import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PrintDirective } from "app/shared/directives";
import { InvoicingService, InvoicingRequest, InvoicingDetailRequest } from "./invoicing.service"
import { DataList, SelectOption } from "app/shared/models";
import { TreeviewItem, TreeviewConfig } from "ngx-treeview/lib";
import { OrderService } from "app/pages/chain/reception/order.service";
import { CentToYuanPipe, DurationHumanizePipe } from "app/shared/pipes";
import * as moment from 'moment';

@Component({
  selector: 'hq-procurement',
  templateUrl: './invoicing.component.html',
  styleUrls: ['./invoicing.component.css']
})
export class InvoicingComponent extends DataList<any> {
  totalDetail: number;
  listDetail: any[];
  private invoicingForm: FormGroup;
  private invoicingDetailForm: FormGroup;
  params: InvoicingRequest;
  paramsDetail: InvoicingDetailRequest;
  detail;
  detailItems;
  showIf: boolean = true;
  detailItemsLength: number;
  isLoading: boolean = false;
  private warehouses: Array<SelectOption>;
  storeId: string;
  searchStart: string;
  searchEnd: string;

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
    protected service: InvoicingService,
    private formBuilder: FormBuilder,
    protected orderService: OrderService,
  ) {
    super(injector, service);
    this.createForm();
    this.createDetailFrom();
    this.params = new InvoicingRequest();
    this.paramsDetail = new InvoicingDetailRequest();
    // 获取可以选择的店名, 用于查询范围筛选
    this.orderService.getSelectableStores().subscribe(data => {
      console.log('采购统计门店数据', data);
      if (data[0].children && data[0].children.length > 0)
        this.items = data;
    });
    this.service.getWarehouseOptions()
      .then(options => this.warehouses = options)
      .catch(err => this.alerter.warn(err));
  }

  @ViewChild('printer')
  public printer: PrintDirective;

  //模态框
  alert(ev, storeId, el) {
    this.storeId = storeId;
    this.invoicingDetailForm.patchValue({
      searchStart: this.invoicingForm.get('searchStart').value,
      searchEnd: this.invoicingForm.get('searchEnd').value
    });
    // this.searchStart = this.invoicingForm.get('searchStart').value;
    // this.searchEnd = this.invoicingForm.get('searchEnd').value;
    ev.hqSpinner = true;
    this.isLoading = true;
    this.onSearchDetail()
    this.showIf = false;
    ev.hqSpinner = false;
  }

  //导出
  onExport() {
    this.service.export(this.params).then(() => {
      console.log('导出成功！', this.params);
    });
  }
  //明细导出
  onDetailExport() {
    this.service.exportDetsil(this.storeId, this.paramsDetail).then(() => {
      console.log(this.searchStart)
      console.log('详情导出成功', this.paramsDetail);
    })
  }
  //搜索
  onSearch() {
    //将表单值赋给params
    Object.assign(this.params, this.invoicingForm.value);
    this.params.searchEnd=this.invoicingForm.get('searchEnd').value+'T23:59:59.999';
    console.log('params', this.params);
    this.onLoadList();
  }

  //明细里的搜索
  onSearchDetail() {
    console.log('form', this.invoicingDetailForm.value)
    //将表单值赋给paramsDetail
    Object.assign(this.paramsDetail, this.invoicingDetailForm.value);
    this.loading = true;
    this.listDetail = null;
    this.service.getDetailPagedList(this.storeId, this.paramsDetail).
      then(m => {
        this.loading = false;
        this.listDetail = m.data;
        console.log(this.searchStart)
        console.log('详情列表', m.data);
      })
      .catch(err => {
        this.alerter.error(err);
        this.loading = false;
      })
  }
  //改变页码
  onPageDetailChanged(event: { page: number, itemsPerPage: number }) {
    this.paramsDetail.setPage(event.page, event.itemsPerPage);
    this.onSearchDetail();
  }
  //绑定表单
  createForm() {
    this.invoicingForm = this.formBuilder.group({
      storeId: '',
      searchStart: moment().subtract(30, 'd').format('YYYY-MM-DD'), //开始时间
      searchEnd: moment().format('YYYY-MM-DD'), // 结束时间
      billCode: '',//单号
      name: '', //供应商
    })
  }

  createDetailFrom() {
    this.invoicingDetailForm = this.formBuilder.group({
      searchStart: '',
      searchEnd: '',
      productCode: '', //配件编码
      productName: '', //配件名称
    })
  }

  onSearchRangeChange(ev) {
    // 更新查询范围参数
    this.params.orgIds = ev;
  }

  joinOrderNumberOnSelect(ev) {
    this.invoicingForm.patchValue({
      billCode: ev.billCode,
    });
  }

  //时间控制
  public get maxEnterStartDate() {
    if (!this.invoicingForm.get('searchEnd').value) {
      return moment().format('YYYY-MM-DD');
    }
    return new Date(this.invoicingForm.get('searchEnd').value);
  }
  public get minEnterEndDate() {
    return new Date(this.invoicingForm.get('searchStart').value) || '';
  }
  public get maxEnterEndDate() {
    return moment().format('YYYY-MM-DD');
  }
  //详情时间控制
  // public get maxEnterStartDateDetail() {
  //   if (!this.invoicingDetailForm.get('searchEnd').value) {
  //     return moment().format('YYYY-MM-DD');
  //   }
  //   return new Date(this.invoicingDetailForm.get('searchEnd').value);
  // }
  // public get minEnterEndDateDetail() {
  //   return new Date(this.invoicingDetailForm.get('searchStart').value) || '';
  // }
  // public get maxEnterEndDateDetail() {
  //   return moment().format('YYYY-MM-DD');
  // }
}
