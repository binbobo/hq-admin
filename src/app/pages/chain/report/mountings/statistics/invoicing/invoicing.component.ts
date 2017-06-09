import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PrintDirective } from "app/shared/directives";
import { InvoicingService, InvoicingRequest, InvoicingDetailRequest } from "./invoicing.service"
import { DataList, SelectOption } from "app/shared/models";
import { TreeviewItem, TreeviewConfig } from "ngx-treeview/lib";
import { CentToYuanPipe, DurationHumanizePipe } from "app/shared/pipes";
import * as moment from 'moment';
import { TotalValueService } from "app/pages/chain/report/total-value/total-value.service";

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
  private stations: Array<any>;
  private stationsView: boolean;

  constructor(
    injector: Injector,
    protected service: InvoicingService,
    private formBuilder: FormBuilder,
    protected totalValueService: TotalValueService,
  ) {
    super(injector, service);
    this.createForm();
    this.createDetailFrom();
    this.params = new InvoicingRequest();
    this.paramsDetail = new InvoicingDetailRequest();
    // 获取可以选择的店名, 用于查询范围筛选
    this.totalValueService.getStationTreeView()
      .then(data => {
        this.stationsView = data.length == 1 && !data[0].children;
        this.stations = data;
      })
      .catch(err => this.alerter.error(err));
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
    this.params.searchEnd = this.invoicingForm.get('searchEnd').value && this.invoicingForm.get('searchEnd').value + 'T23:59:59.999';
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
  //配件模糊搜索
  onSelect(ev) {
    this.invoicingDetailForm.patchValue({
      productCode: ev.code,
      productName: ev.name
    });
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
    this.invoicingForm.patchValue({
      billCode: ev.billCode,
    });
  }
  //时间控制
  public get maxEnterStartDate() {
    if (!this.invoicingForm.get('searchEnd').value) {
      return new Date(moment().format('YYYY-MM-DD'));
    }
    return new Date(this.invoicingForm.get('searchEnd').value);
  }
  public get minEnterEndDate() {
    return new Date(moment(this.invoicingForm.get('searchStart').value).subtract(1, 'd').format('YYYY-MM-DD')) || '';
  }
  public get maxEnterEndDate() {
    return new Date(moment().format('YYYY-MM-DD'));
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
