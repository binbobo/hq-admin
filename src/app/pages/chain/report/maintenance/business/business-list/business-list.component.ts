import { Component, OnInit, ViewChildren, QueryList, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataList, StorageKeys } from "app/shared/models";
import { BusinessService, BusinessListRequest, FuzzySearchRequest } from "../business.service";
import { SecondToTimePipe } from "app/shared/pipes";
import { TypeaheadRequestParams } from "app/shared/directives";

@Component({
  selector: 'hq-business-list',
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css']
})
export class BusinessListComponent extends DataList<any> {

  private businessForm: FormGroup;
  private converter: SecondToTimePipe = new SecondToTimePipe();
  params: BusinessListRequest;
  public isShow = false;//查询范围是否显示
  public isSearch = false;//温馨提示是否显示

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

  plateNoOnSelect(){}
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
  //查询
  onSearch() {
    if (this.params.plateNo) {
      this.isSearch = true;
    }
    this.onLoadList();
    
  }
  //导出报表
  onExport() {
    this.service.export(this.params).then(() => {
      console.log('导出维修历史数据成功！');
    });
  }
  //详情
  businessDetailsHandler(evt, id, modalDialog) {
    evt.preventDefault();
    modalDialog.show();
  }

}
