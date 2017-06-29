import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PrintDirective, HqModalDirective } from "app/shared/directives";
import { ProcurementService, ProcurementRequest } from "./procurement.service"
import { DataList } from "app/shared/models";
import { TreeviewItem, TreeviewConfig } from "ngx-treeview";
import { CentToYuanPipe, DurationHumanizePipe } from "app/shared/pipes";
import * as moment from 'moment';
import { TotalValueService } from "app/pages/chain/report/total-value/total-value.service";

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
  printTitle:string;
  detailItemsLength: number;
  isLoading: boolean = false;
  private stations: Array<any>;
  private orgShow = false;
  private orgNameShow = false;
  @ViewChild('bdModal')
  private bdModal: HqModalDirective;

  constructor(
    injector: Injector,
    protected service: ProcurementService,
    private formBuilder: FormBuilder,
    protected totalValueService: TotalValueService,
  ) {
    super(injector, service);
    this.createForm();
    this.params = new ProcurementRequest();
    // 获取可以选择的店名, 用于查询范围筛选
    this.totalValueService.getStationTreeView()
      .then(data => {
        this.stations = data;
        if (this.stations.length > 1 || this.stations.find(m => m.children.length > 0))
          this.orgShow = true;
      })
      .catch(err => this.alerter.error(err));

  }

  @ViewChild('printer')
  public printer: PrintDirective;

  //打印
  print() {
    this.printer.print();
    this.bdModal.hide();
  }

  //模态框
  alert(ev, id, el,isOut) {
    ev.hqSpinner = true;
    this.service.get(`${id}?isOut=${isOut}`).then(data => {
      this.isLoading = true;
      this.detail = data||{};
      this.detailItemsLength = data.items.length;
      this.detailItems = data.items;
      this.printTitle=this.detailItems[0].exTaxAmount>0?'采购入库单':'采购退库单';
      console.log('详情数据', this.detailItems[0].exTaxAmount)
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
    this.orgNameShow = false;
    this.onLoadList();
    if (this.params.orgIds && this.params.orgIds.length > 1) {
      this.orgNameShow = true;
    }
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
    let orgIdsArr: Array<any> = [];
    ev.map(m => {
      orgIdsArr.push(m.value)
    })
    this.params.orgIds = orgIdsArr;
    console.log('查询范围', ev, this.params.orgIds);
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
