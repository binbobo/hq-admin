import { Component, OnInit, ViewChildren, QueryList, Injector, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataList, StorageKeys } from "app/shared/models";
import { BusinessService, BusinessListRequest, FuzzySearchRequest } from "../business.service";
import { TypeaheadRequestParams, PrintDirective } from "app/shared/directives";
import { CentToYuanPipe, DurationHumanizePipe } from "app/shared/pipes";
import { TreeviewItem, TreeviewConfig } from "ngx-treeview/lib";
import { OrderService } from "app/pages/chain/reception/order.service";

@Component({
  selector: 'hq-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent extends DataList<any> {

  private businessForm: FormGroup;
  params: BusinessListRequest;
  public isShow = false;//查询范围是否显示
  public isSearch = false;//温馨提示是否显示
  private converter: CentToYuanPipe = new CentToYuanPipe();
  private pipe: DurationHumanizePipe = new DurationHumanizePipe();
  @ViewChild('printer')
  public printer: PrintDirective;
  private businessData: any;//维修历史详情
  private moneyObj = null;

  // 用于ngx-treeview组件
  public items: TreeviewItem[];
  public config: TreeviewConfig = {
    isShowAllCheckBox: true,
    isShowFilter: true,
    isShowCollapseExpand: true,
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
    // 获取可以选择的店名, 用于查询范围筛选
    this.orderService.getSelectableStores().subscribe(data => {
      console.log('门店数据', data);
      if (data[0].children && data[0].children.length > 0)
        this.items = data;
    });
    this.createForm();

  }

  createForm() {
    this.businessForm = this.formBuilder.group({
      plateNo: '', //车牌号
      enterStartTimeDate: '', // 进店开始时间
      enterEndTimeDate: '', // 进店结束时间
      leaveStartTimeDate: '', // 出厂开始时间
      leaveEndTimeDate: '', // 出厂结束时间
      // orgIds: '', //查询范围
    })
  }

  //车牌号模糊查询数据源
  private typeaheadSource(service) {
    return (params: TypeaheadRequestParams) => {
      const p = new FuzzySearchRequest(params.text);
      p.setPage(params.pageIndex, params.pageSize);
      return service.call(this.service, p);
    };
  }

  plateNoOnSelect(event) {
    let item = {
      plateNo: event.plateNo
    }
    setTimeout(() => {
      this.businessForm.patchValue(item);
    }, 1);
  }
  //定义模糊查询要显示的列
  public get typeaheadColumns() {
    return [
      { name: 'plateNo', title: '车牌号' },
      { name: 'customerName', title: '车主' },
      { name: 'phone', title: '车主电话' },
    ];
  }
  //根据车牌号模糊查询
  public get plateNotypeaheadSource() {
    return this.typeaheadSource(this.service.getCustomerVehicleByPlateNo);
  }
  //门店下拉框选择
  onSearchRangeChange(evt) {
    // 更新查询范围参数
    this.params.orgIds = evt;

    console.log('当前选择的查询范围列表：', this.params.orgIds);
  }

  //条件查询维修历史
  onSearch() {
    this.isSearch = false;
    if (this.params.plateNo) {
      this.isSearch = true;
    }
    this.onLoadList();

  }
  //导出维修历史
  onExport() {
    this.service.export(this.params).then(() => {
      console.log('导出维修历史数据成功！');
    });
  }
  //详情
  businessDetailsHandler(eve, id, modalDialog) {
    // evt.preventDefault();
    eve.generating  =true;
    this.moneyObj = {
      amountReceivable1: 0,//表一应收金额
      amountReceivable2: 0,//表二应收金额（工时费）
      amountReceivable3: 0,//表三应收金额（材料费）
      discountMoney1: 0,//表一折扣金额
      discountMoney2: 0,//表二折扣金额
    }
    //根据ID获取维修历史详情
    this.service.get(id).then(data => {
      this.businessData = data;
      console.log('根据ID获取维修详情', this.businessData);
      //表二
      this.businessData.workHours.forEach(item => {
        this.moneyObj.amountReceivable2 += item.amount;//应收金额(待校验)
        this.moneyObj.discountMoney2 += item.amount - item.discountCost;//折扣金额(待校验)
      });
      //表三
      this.businessData.matereialDetails.forEach(item => {
        this.moneyObj.amountReceivable3 += item.amount;//应收金额(待校验)
      });
      //表一
      this.businessData.totalCost.forEach(item => {
        // this.moneyObj.workHourPrice = this.moneyObj.amountReceivable2;//工时费
        // this.moneyObj.productPrice = this.moneyObj.amountReceivable3;//材料费
        this.moneyObj.discountMoney1 += item.receivableCost - item.discountCost;//折扣金额
        this.moneyObj.amountReceivable1 += item.receivableCost;//应收金额
      });
      this.businessData['moneyObj'] = this.moneyObj;
      eve.generating = false;
      modalDialog.show()
      console.log('打印数据', this.businessData);
    })
      .catch(err => {
        this.alerter.error('获取详情信息失败: ' + err, true, 2000);
        eve.generating = false;
      });
    // setTimeout(() => modalDialog.show(), 300);

  }
  print() {
    this.printer.print();
  }

}