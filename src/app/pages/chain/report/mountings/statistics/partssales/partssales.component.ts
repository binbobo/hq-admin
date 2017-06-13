import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PrintDirective } from "app/shared/directives";
import { PartssalesService, PartssalesRequest } from "./partssales.service"
import { DataList } from "app/shared/models";
import { TreeviewItem, TreeviewConfig } from "ngx-treeview/lib";
import { CentToYuanPipe, DurationHumanizePipe } from "app/shared/pipes";
import * as moment from 'moment';
import { TotalValueService } from "app/pages/chain/report/total-value/total-value.service";
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
  private stations: Array<any>;
  private orgShow = false;
  private orgNameShow = false;
  constructor(
    injector: Injector,
    protected service: PartssalesService,
    private formBuilder: FormBuilder,
    protected totalValueService: TotalValueService,
  ) {
    super(injector, service);
    this.createForm();
    this.params = new PartssalesRequest();
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

  //客戶名陳/手机联动
  changeVal(e) {
    this.partssalesForm.patchValue({
      name: e.name,
      phone: e.phone
    });
  }

  //搜索
  onSearch() {
    //将表单值赋给params
    Object.assign(this.params, this.partssalesForm.value);
    this.params.searchEnd = this.partssalesForm.get('searchEnd').value && this.partssalesForm.get('searchEnd').value + 'T23:59:59.999';
    console.log('params', this.params);
    this.orgNameShow = false;
    this.onLoadList();
    if (this.params.orgIds && this.params.orgIds.length > 1) {
      this.orgNameShow = true;
    }
  }

  //绑定表单
  createForm() {
    this.partssalesForm = this.formBuilder.group({
      searchStart: moment().subtract(30, 'd').format('YYYY-MM-DD'),  //开始时间
      searchEnd: moment().format('YYYY-MM-DD'),    // 结束时间
      name: '',         //供应商
      phone: '',         //供应商手机
      productCode: '',
      productCategory: '',
      productName: ''
    })
  }

  onSelect(ev) {
    console.log("配件编码", ev)
    this.partssalesForm.patchValue({
      productCode: ev.code,
      productCategory: ev.categoryName,
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
    this.partssalesForm.patchValue({
      billCode: ev.billCode,
    });
  }
  //时间控制
  public get maxEnterStartDate() {
    if (!this.partssalesForm.get('searchEnd').value) {
      return new Date(moment().format('YYYY-MM-DD'));
    }
    return new Date(this.partssalesForm.get('searchEnd').value);
  }
  public get minEnterEndDate() {
    return new Date(moment(this.partssalesForm.get('searchStart').value).subtract(1, 'd').format('YYYY-MM-DD')) || '';
  }
  public get maxEnterEndDate() {
    return new Date(moment().format('YYYY-MM-DD'));
  }

}
