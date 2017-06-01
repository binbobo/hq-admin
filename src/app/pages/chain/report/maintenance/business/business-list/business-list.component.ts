import { Component, OnInit, ViewChildren, QueryList, Injector, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataList, StorageKeys } from "app/shared/models";
import { BusinessService, BusinessListRequest, DetailsSearchRequest } from "../business.service";
import { TypeaheadRequestParams, PrintDirective } from "app/shared/directives";
import { CentToYuanPipe, DurationHumanizePipe } from "app/shared/pipes";
import { TreeviewItem, TreeviewConfig } from "ngx-treeview/lib";
import { OrderService } from "app/pages/chain/reception/order.service";
import { ModalDirective } from "ngx-bootstrap";
import * as moment from 'moment';

@Component({
  selector: 'hq-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent extends DataList<any> {

  private detailsId;
  private orgItems;
  private businessForm: FormGroup;
  params: BusinessListRequest;
  @ViewChild('bdModal')
  private bdModal: ModalDirective;

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
  public items: TreeviewItem[];
  public config: TreeviewConfig = {
    isShowAllCheckBox: true,
    isShowFilter: true,
    isShowCollapseExpand: true,
    maxHeight: 500
  };

  // 用于服务顾问ngx-treeview组件
  public nameItems: TreeviewItem[];
  public nameConfig: TreeviewConfig = {
    isShowAllCheckBox: true,
    isShowFilter: true,
    isShowCollapseExpand: false,
    maxHeight: 500
  };

  constructor(
    injector: Injector,
    protected service: BusinessService,
    protected orderService: OrderService,
    private formBuilder: FormBuilder,
  ) {
    super(injector, service);
    this.params = new BusinessListRequest();
    this.onLoadList();
    // 获取可以选择的店名, 用于查询范围筛选
    this.orderService.getSelectableStores().subscribe(data => {
      if (data[0].children && data[0].children.length > 0)
        this.items = data;
    });
    // 获取可以选择的服务顾问, 用于查询范围筛选
    this.service.getEmployeesStores().subscribe(data => {
      // if (data[0].children && data[0].children.length > 0)
      this.nameItems = data;
    });
  }

  //门店下拉框选择
  onSearchRangeChange(evt) {
    // 更新查询范围参数
    if (evt.length) {
      this.params.orgIds = evt;
    } else {
      this.params.orgIds = null;
    }
  }

  //服务顾问下拉框选择
  onSearchNameChange(evt) {
    // 更新查询范围参数
    if (evt.length) {
      this.params.employees = evt;
    } else {
      this.params.employees = null;
    }
  }


  //条件查询维修历史
  onSearch() {
    this.isSearch = false;
    this.isShow1 = false;
    this.isShow2 = false;
    this.orgItems = this.params.orgIds;
    // this.onLoadList();
    this.params.setPage(1);
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
      });
  }
  //导出维修历史
  onExport() {
    this.service.export(this.params).then(() => {
      console.log('导出维修历史数据成功！');
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
  //进店时间控制
  public get maxEnterStartDate() {
    return this.params.enterEndTimeDate || moment().format('YYYY-MM-DD');
  }
  public get minEnterEndDate() {
    return this.params.enterStartTimeDate || '';
  }
  public get maxEnterEndDate() {
    return moment().format('YYYY-MM-DD');
  }
  //出厂时间控制
  public get maxLeaveStartDate() {
    return this.params.leaveEndTimeDate || moment().format('YYYY-MM-DD');
  }
  public get minLeaveEndDate() {
    return this.params.leaveStartTimeDate || '';
  }
  public get maxLeaveEndDate() {
    return moment().format('YYYY-MM-DD');
  }

}