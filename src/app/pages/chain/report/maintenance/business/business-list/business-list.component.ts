import { Component, OnInit, ViewChildren, QueryList, Injector, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataList, StorageKeys } from "app/shared/models";
import { BusinessService, BusinessListRequest, DetailsSearchRequest } from "../business.service";
import { TypeaheadRequestParams, PrintDirective, HqModalDirective } from "app/shared/directives";
import { CentToYuanPipe, DurationHumanizePipe } from "app/shared/pipes";
import { TreeviewItem, TreeviewConfig } from "ngx-treeview/lib";
import { ModalDirective } from "ngx-bootstrap";
import * as moment from 'moment';
import { TotalValueService } from "app/pages/chain/report/total-value/total-value.service";

@Component({
  selector: 'hq-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent extends DataList<any> {

  private enterStartTime: string;//进厂开始时间
  private enterEndTime: string;//进厂截止时间
  private leaveStartTime: string;//出厂开始时间
  private leaveEndTime: string;//出厂截止时间
  private detailsId;
  private orgItems;
  private businessForm: FormGroup;
  params: BusinessListRequest;
  @ViewChild('bdModal')
  private bdModal: HqModalDirective;
  private exportGenerating = false;
  public isSearch = false;//温馨提示是否显示
  public isShow1 = false;//温馨提示是否显示
  public isShow2 = false;//温馨提示是否显示
  private converter: CentToYuanPipe = new CentToYuanPipe();
  private pipe: DurationHumanizePipe = new DurationHumanizePipe();
  @ViewChild('printer')
  public printer: PrintDirective;
  private businessData: any;//维修历史详情
  private moneyObj = null;

  // 用于查询范围ngx-treeview组件
  private stations: Array<any>;
  private orgShow = false;//门店选择是否显示
  private orgNameShow = false;//店名是否显示

  // 用于服务顾问ngx-treeview组件
  public nameItems: TreeviewItem[];

  constructor(
    injector: Injector,
    protected service: BusinessService,
    private totalValueService: TotalValueService,
    private formBuilder: FormBuilder,
  ) {
    super(injector, service);
    this.params = new BusinessListRequest();
    this.onLoadList();
    // 获取可以选择的店名, 用于查询范围筛选
    this.totalValueService.getStationTreeView()
      .then(data => {
        this.stations = data;
        if (this.stations.length > 1 || this.stations.find(m => m.children.length > 0))
          this.orgShow = true;
      })
      .catch(err => this.alerter.error(err));
  }

  //门店下拉框选择
  onStationSelect(evt) {
    if (evt.length) {
      let orgIdsArr = [];
      evt.map(m => {
        orgIdsArr.push(m.value);
      })
      this.params.orgIds = orgIdsArr;
    } else {
      this.params.orgIds = null;
    }
  }

  //条件查询维修历史
  onSearch() {
    this.isSearch = false;
    this.isShow1 = false;
    this.isShow2 = false;
    this.orgNameShow = false;
    this.orgItems = this.params.orgIds;
    // this.onLoadList();
    this.params.enterStartTimeDate = this.enterStartTime;
    this.params.enterEndTimeDate = this.enterEndTime;
    this.params.leaveStartTimeDate = this.leaveStartTime;
    this.params.leaveEndTimeDate = this.leaveEndTime;
    this.params.enterEndTimeDate = this.params.enterEndTimeDate && moment(this.params.enterEndTimeDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS');
    this.params.leaveEndTimeDate = this.params.leaveEndTimeDate && moment(this.params.leaveEndTimeDate).endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS');
    this.index = 1;
    this.params.setPage(1, this.size);
    this.loadList()
      .then(() => {
        if (this.params.plateNo) {
          this.isSearch = true;
          if (this.total > 0) {
            this.isShow1 = true;
            this.isShow2 = false;
          } else {
            this.isShow1 = false;
            this.isShow2 = true;
          }
        }
      })
      .then(() => {
        if (this.orgItems && this.orgItems.length > 1)
          this.orgNameShow = true;
      });
  }
  //导出维修历史
  onExport() {
    this.exportGenerating = true;
    this.service.export(this.params).then(() => {
      this.alerter.success('导出维修历史成功！');
      this.exportGenerating = false;
    }).catch(err => {
      this.exportGenerating = false;
      this.alerter.error('导出维修历史失败：' + err, true, 3000);
    });
  }
  //详情
  businessDetailsHandler(eve, id) {
    eve.generating = true;
    this.detailsId = id;
    this.moneyObj = {
      amountReceivable1: 0,//表一应收金额
      amountReceivable2: 0,//表二应收金额（工时费）
      amountReceivable3: 0,//表三应收金额（材料费）
      discountMoney1: 0,//表一折扣金额
      discountMoney2: 0,//表二折扣金额
      countMoney2: 0,//表二应收金额
    }
    //根据ID获取维修历史详情
    this.service.getDetails(this.detailsId, this.orgItems).then(data => {
      this.businessData = data;
      //表二
      this.businessData.workHours.forEach(item => {
        this.moneyObj.amountReceivable2 += item.amount;//合计金额
        this.moneyObj.discountMoney2 += item.amount - item.discountCost;//折扣金额
        this.moneyObj.countMoney2 += item.discountCost;//应收金额
      });
      //表三
      this.businessData.matereialDetails.forEach(item => {
        this.moneyObj.amountReceivable3 += item.amount;//应收金额
      });
      //表一
      this.businessData.totalCost.forEach(item => {
        this.moneyObj.discountMoney1 += item.receivableCost - item.discountCost;//折扣
        this.moneyObj.amountReceivable1 += item.receivableCost;//合计金额
      });
      if (this.businessData.deduceAmount) {
        this.moneyObj.discountMoney1 = this.moneyObj.discountMoney1 + this.businessData.deduceAmount;//优惠（折扣+抹零）
      }
      this.businessData['moneyObj'] = this.moneyObj;
      eve.generating = false;
      this.bdModal.show()
    })
      .catch(err => {
        this.alerter.error('获取详情信息失败: ' + err, true, 2000);
        eve.generating = false;
      });
  }
  print() {
    this.printer.print();
    this.bdModal.hide();
  }
  //进厂时间控制
  public get maxEnterStartDate() {
    if (!this.enterEndTime)
      return new Date(moment().format('YYYY-MM-DD'));
    let newDate = moment(this.enterEndTime).toDate();
    return newDate;
  }
  public get minEnterEndDate() {
    if (!this.enterStartTime)
      return '';
    return new Date(moment(this.enterStartTime).subtract(1, 'd').format('YYYY-MM-DD'));
  }
  public get maxEnterEndDate() {
    return new Date(moment().format('YYYY-MM-DD'));
  }
  //出厂时间控制
  public get maxLeaveStartDate() {
    if (!this.leaveEndTime)
      return new Date(moment().format('YYYY-MM-DD'));
    let newDate = moment(this.leaveEndTime).toDate();
    return newDate;
  }
  public get minLeaveEndDate() {
    if (!this.leaveStartTime)
      return '';
    return new Date(moment(this.leaveStartTime).subtract(1, 'd').format('YYYY-MM-DD'));
  }
  public get maxLeaveEndDate() {
    return new Date(moment().format('YYYY-MM-DD'));
  }

}