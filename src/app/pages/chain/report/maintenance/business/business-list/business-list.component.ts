import { Component, OnInit, ViewChildren, QueryList, Injector, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataList, StorageKeys } from "app/shared/models";
import { BusinessService, BusinessListRequest, FuzzySearchRequest } from "../business.service";
import { TypeaheadRequestParams, PrintDirective } from "app/shared/directives";
import { CentToYuanPipe } from "app/shared/pipes";

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
  @ViewChild('printer')
  public printer: PrintDirective;
  private costData:any;//收费结算单
  private workHourData:any;//工时明细
  private matereialData:any;//配件明细
  private businessData:any;//维修历史详情
  private moneyObj = null;

  constructor(
    injector: Injector,
    protected service: BusinessService,
    private formBuilder: FormBuilder,
  ) {
    super(injector, service);
    this.params = new BusinessListRequest();
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
  businessDetailsHandler(evt, id, modalDialog) {
    evt.preventDefault();
    this.moneyObj = {
      amountReceivable1:0,//表一应收金额
      amountReceivable2:0,//表二应收金额（工时费）
      amountReceivable3:0,//表三应收金额（材料费）
      discountMoney1:0,//表一折扣金额
      discountMoney2:0,//表二折扣金额
      // workHourPrice:0,//工时费
      // productPrice:0,//材料费
    }
    modalDialog.show();
    //根据ID获取维修历史详情
    console.log('详情id', id);
    this.service.get(id).then(data => {
      this.businessData = data;
      console.log('根据ID获取维修详情', this.businessData);
      this.costData = data.totalCost;
      this.workHourData = data.workHours;
      this.matereialData = data.matereialDetails;
      //表二
      this.workHourData.forEach(item => {
        this.moneyObj.amountReceivable2 += item.amount;//应收金额(待校验)
        this.moneyObj.discountMoney2 += item.amount-item.discountCost ;//折扣金额(待校验)
      });
      //表三
      this.matereialData.forEach(item => {
        this.moneyObj.amountReceivable3 += item.amount;//应收金额(待校验)
      });
      //表一
      this.costData.forEach(item => {
        // this.moneyObj.workHourPrice = this.moneyObj.amountReceivable2;//工时费
        // this.moneyObj.productPrice = this.moneyObj.amountReceivable3;//材料费
        this.moneyObj.discountMoney1 += item.receivableCost - item.discountCost;//折扣金额
        this.moneyObj.amountReceivable1 += item.receivableCost;//应收金额
      });
    })
      .catch(err => Promise.reject(`获取维修历史详情失败：${err}`));
    
  }
  print() {
    // this.printer.print();
  }
  
}