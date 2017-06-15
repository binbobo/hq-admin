import { Component, OnInit, Injector, ViewChild } from '@angular/core';
import { DistributeService, DistributeRequest } from './distribute.service'
import { TreeviewItem, TreeviewConfig } from "ngx-treeview/lib";
import { DataList } from "app/shared/models";
import { FormGroup, FormBuilder } from "@angular/forms";
import { PrintDirective, TypeaheadRequestParams } from "app/shared/directives";
import { CentToYuanPipe, DurationHumanizePipe } from "app/shared/pipes";
import * as moment from 'moment';
import { TotalValueService } from "app/pages/chain/report/total-value/total-value.service";

@Component({
  selector: 'hq-distribute',
  templateUrl: './distribute.component.html',
  styleUrls: ['./distribute.component.css']
})
export class DistributeComponent extends DataList<any> {
  params: DistributeRequest = new DistributeRequest();
  private distributeForm: FormGroup;
  detail;
  detailItems;
  detailItemsLength: number;
  isLoading: boolean = false;
  private stations: Array<any>;
  private orgShow = false;
  private orgNameShow = false;
  constructor(
    protected service: DistributeService,
    injector: Injector,
    private formBuilder: FormBuilder,
    protected totalValueService: TotalValueService,
  ) {
    super(injector, service);
    this.ngOnInit();
    this.bindForm();
    // 获取可以选择的店名, 用于查询范围筛选
    this.totalValueService.getStationTreeView()
      .then(data => {
        this.stations = data;
        if (this.stations.length > 1 || this.stations.find(m => m.children.length > 0))
          this.orgShow = true;
      })
      .catch(err => this.alerter.error(err));
  }

  //详情模态框
  alert(ev, id, bdModule, billCode,isOut) {
    ev.hqSpinner = true;
    this.service.get(`${id}&isOut=${isOut}`).then(data => {
    console.log('详情数据', data);
      this.isLoading = true;
      this.detail = data[0]||{};
      this.detail.billCode = billCode;
      this.detailItemsLength = data.length;
      this.detailItems = data;
      bdModule.show();
      ev.hqSpinner = false;
    }).catch((err) => {
      // console.log('err', err)
      ev.hqSpinner = false;
      this.alerter.error(err, true, 2000);
    });
  }

  //门店查询
  onSearchRangeChange(ev) {
    let orgIdsArr: Array<any> = [];
    ev.map(m => {
      orgIdsArr.push(m.value)
    })
    this.params.orgIds = orgIdsArr;
    console.log('查询范围', ev, this.params.orgIds);
  }
  @ViewChild('printer')
  public printer: PrintDirective;

  //打印
  print() {
    this.printer.print();
  }
  //导出
  onExport() {
    this.service.export(this.params).then(() => {
      console.log('导出成功！', this.params);
    });
  }

  //搜索
  onSearch() {
    Object.assign(this.params, this.distributeForm.value)
    this.params.searchEnd = this.distributeForm.get('searchEnd').value && this.distributeForm.get('searchEnd').value + 'T23:59:59.999';
    this.orgNameShow=false;
    this.onLoadList();
    if(this.params.orgIds&&this.params.orgIds.length>1){
      this.orgNameShow=true;
    }
  }

  onSelect(ev) {
    this.distributeForm.patchValue({
      plateNo: ev.plateNo
    });
  }

  //绑定表单
  bindForm() {
    this.distributeForm = this.formBuilder.group({
      plateNo: '',//车牌号
      searchStart: moment().subtract(30, 'd').format('YYYY-MM-DD'), //开始时间
      searchEnd: moment().format('YYYY-MM-DD'), // 结束时间
    })
  }
  //时间控制
  public get maxEnterStartDate() {
    if (!this.distributeForm.get('searchEnd').value) {
      return new Date(moment().format('YYYY-MM-DD'));
    }
    return new Date(this.distributeForm.get('searchEnd').value);
  }
  public get minEnterEndDate() {
    return new Date(moment(this.distributeForm.get('searchStart').value).subtract(1, 'd').format('YYYY-MM-DD')) || '';
  }
  public get maxEnterEndDate() {
    return new Date(moment().format('YYYY-MM-DD'));
  }
}
