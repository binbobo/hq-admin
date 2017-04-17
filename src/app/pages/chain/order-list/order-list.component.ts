import { Component, Injector, ElementRef, ViewChild, ContentChild } from '@angular/core';
import { DataList } from '../../../shared/models/data-list';
import { TreeviewItem, TreeviewConfig } from 'ng2-dropdown-treeview';
import { OrderService, OrderListRequest, Order } from '../order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})

// 此处不能实现 OnInit 接口, 因为父类已经实现了该接口, 会从父类中继承过来
// 如果此处也实现 OnInit 接口（implements OnInit）, 会重写父类中的相应方法
export class OrderListComponent extends DataList<Order> {
  // 用于日期组件
  public showDatePicker = false;

  public showAdvanceFilter = false;

  // 用于ng2-dropdown-treeview组件
  public items: TreeviewItem[];
  public config: TreeviewConfig = {
    isShowAllCheckBox: true,
    isShowFilter: true,
    isShowCollapseExpand: true,
    maxHeight: 500
  };

  @ContentChild('advanceFilter') advanceFilter: ElementRef;

  // 表单
  workSheetFilterForm: FormGroup;


   constructor(
    injector: Injector,
    protected service: OrderService,
    private fb: FormBuilder
  ) {
    super(injector, service);
    this.params = new OrderListRequest();

    // 获取可以选择的店名, 用于查询范围筛选
    this.items = this.service.getSelectableStores();

    // 构建表单
    this.createForm();
  }

   createForm() {
    this.workSheetFilterForm = this.fb.group({
      toBeAssigned: '',
      toBeChecked: '',
      toBeBalanced: '',
      toBeCheckedOut: '',
      finished: '',
      all: '',
      carNo: '',
      carOwner: '',
      carOwnerPhone: '',
      sender: '',
      senderPhone: '',
      carBrand: '',
      carSeries: '',
      orderNo: '',
      serviceConsultant: '',
      carType: '',
      repairType: '',
      enterStoreTimeStart: '',
      enterStoreTimeEnd: '',
      leaveFactoryTimeStart: '',
      leaveFactoryTimeEnd: '',
    }); 
  }


  // 切换是否显示日期组件标志
  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  onSerarch() {
    // 获取表单数据
    const workSheetFilterFormModel = this.workSheetFilterForm.value;
    // 追加dropdown-treeview下
  }

  toggleAdvanceFilter() {
    this.showAdvanceFilter = this.showAdvanceFilter;
    console.log(this.advanceFilter);
  }

  // 重置为初始查询条件
  revert() { 
    this.workSheetFilterForm.reset();
  }
}
