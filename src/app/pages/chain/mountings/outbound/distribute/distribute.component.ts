import { Component, OnInit, Injector } from '@angular/core';
import { DataList, StorageKeys } from "app/shared/models";
import { Router } from "@angular/router";
import { DistributeService, DistributeRequest } from "./distribute.service";
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'hq-distribute',
  templateUrl: './distribute.component.html',
  styleUrls: ['./distribute.component.css'],
  providers: [DistributeService]
})
export class DistributeComponent extends DataList<any>{
  ChooseOrderForm: FormGroup;
  params: DistributeRequest;
  constructor(
    private router: Router,
    injector: Injector,
    protected service: DistributeService,
    private fb: FormBuilder) {
    super(injector, service)
    this.params = new DistributeRequest();
    // 构建表单
    this.createForm();
  }
  onSearch() {

  }
  OnChooseOrder(evt, modalDialog) {
    evt.preventDefault();

    modalDialog.show();
  }
  public get typeaheadColumns() {
    return [
      { name: 'plateNo', title: '车牌号' },
      { name: 'billCode', title: '工单号' }
    ];
  }

  public onTypeaheadSelect($event) {


  }

  // public get typeaheadSource() {

  // }

  createForm() {
    this.ChooseOrderForm = this.fb.group({
      keyword: '', // 车牌号或车主姓名或工单号
      plateNo: '',  //车牌号
      billcode: '', //工单号
    });
  }


}
