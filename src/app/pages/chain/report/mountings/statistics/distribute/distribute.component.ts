import { Component, OnInit, Injector } from '@angular/core';
import { DistributeService, DistributeRequest } from './distribute.service'
import { TreeviewItem, TreeviewConfig } from "ngx-treeview/lib";
import { DataList } from "app/shared/models";
import { FormGroup, FormBuilder } from "@angular/forms";
import { OrderService } from "app/pages/chain/reception/order.service";
import { PrintDirective } from "app/shared/directives";

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

  constructor(
    protected service: DistributeService,  
    protected orderService: OrderService,
    injector: Injector,
    private formBuilder: FormBuilder,
  ) {
    super(injector, service);
    this.ngOnInit();
    this.bindForm();
    // 获取可以选择的店名, 用于查询范围筛选
    this.orderService.getSelectableStores().subscribe(data => {
      console.log('门店数据', data);
      if (data[0].children && data[0].children.length > 0)
        this.items = data;
    });
  }

  // 用于ngx-treeview组件
  public items: TreeviewItem[];
  public config: TreeviewConfig = {
    isShowAllCheckBox: false,
    isShowFilter: false,
    isShowCollapseExpand: true,
    maxHeight: 500
  };


  //详情模态框
  alert(ev, id, bdModule) {
    console.log('详情数据',ev,id,bdModule);
    ev.hqSpinner = true;
    this.service.get(id).then((data) => {
      this.isLoading = true;
      this.detail = data;
      this.detailItemsLength = data.items.length;
      this.detailItems = data.items;
      bdModule.show();
      ev.hqSpinner = false;
    }).catch((err) => {
      this.alerter.error(err, true, 2000);
    });
  }

  //门店查询
  onSearchRangeChange(ev) {
    this.params.orgIds = ev;
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
    this.onLoadList();
  }

  //绑定表单
  bindForm() {
    this.distributeForm = this.formBuilder.group({
      plateNo: '',//车牌号
      searchStart: '', //开始时间
      searchEnd: '', // 结束时间
    })
  }
}
