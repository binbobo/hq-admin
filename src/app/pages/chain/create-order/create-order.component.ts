import { Component, Injector } from '@angular/core';
import { DataList } from '../../../shared/models/data-list';
import { OrderService, OrderListRequest, Order } from '../order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css'],
})
export class CreateOrderComponent extends DataList<Order> {
  // 创建工单表单
  createWorkSheetForm: FormGroup;
  // ng2-smart-table

  // 维修项目表头
  maintanceItemSettings = {
    columns: {
      name: {
        title: '维修项目名称'
      },
      manHours: {
        title: '维修工时(小时)'
      },
      usemanHourPrice: {
        title: '工时单价(元)'
      },
      money: {
        title: '金额(元)'
      },
      discountRatio: {
        title: '折扣率'
      },
      operationTime: {
        title: '操作时间'
      }
    }
  };
  // 维修配件表头
  maintanceFixingsSettings = {
    columns: {
      item: {
        title: '维修项目'
      },
      name: {
        title: '配件名称'
      },
      brand: {
        title: '品牌'
      },
      type: {
        title: '规格型号'
      },
      amount: {
        title: '数量'
      },
      price: {
        title: '单价(元)'
      },
      money: {
        title: '金额(元)'
      },
      operationTime: {
        title: '操作时间'
      }
    }
  };
  // 附加项目表头
  addsOnItemSettings = {
    columns: {
      name: {
        title: '项目名称'
      },
      amount: {
        title: '数量'
      },
      price: {
        title: '单价(元)'
      },
      money: {
        title: '金额(元)'
      },
      remark: {
        title: '备注'
      }
    }
  };

  // 建议维修项目表头
  suggestedMaintanceSettings = {
    columns: {
      name: {
        title: '建议维修项目'
      },
      isRecieved: {
        title: '是否修理'
      },
      oprationTime: {
        title: '操作时间'
      },
      operator: {
        title: '操作员'
      },
      remark: {
        title: '备注'
      }
    }
  };
  // 客户回访记录表头
  returnVisitSettings = {
    columns: {
      dateTime: {
        title: '回访时间'
      },
      visitor: {
        title: '回访人'
      },
      quality: {
        title: '维修质量'
      },
      attitude: {
        title: '服务态度'
      },
      restEnvironment: {
        title: '休息环境'
      },
      manHourPrice: {
        title: '工时价格'
      },
      fixingsPrice: {
        title: '配件价格'
      },
      isCheckedCar: {
        title: '接车时是否验车'
      },
      isPriceQuoted: {
        title: '是否报价'
      },
      hasSuggestedItem: {
        title: '有无建议项目'
      }
    }
  };

  // 挂起的工单
  public unsettledOrders;

  constructor(
    injector: Injector,
    protected service: OrderService,
    private fb: FormBuilder,
  ) {
    super(injector, service);
    this.params = new OrderListRequest();

    // 构建表单
    this.createForm();

    // 获取挂起的订单
    this.unsettledOrders = this.getUnsettledOrders();
  }

  getUnsettledOrders() {
    return [{
      carOwner: '蛋蛋',
      carOwnerPhone: '13488618198',
      carNo: '京AH11P9'
    }, {
      carOwner: '池子',
      carOwnerPhone: '13488618198',
      carNo: 'AH11P9'
    }];
  }

  /**
   * 点击挂单列表的时候, 载入挂单信息
   * @memberOf CreateOrderComponent
   */
  loadOrderInfo(order, pop) {
    // 隐藏popover
    pop.hide();
    console.log(order)
  }

  createForm() {
    this.createWorkSheetForm = this.fb.group({
      carNo: '',
      carOwner: '',
      carOwnerPhone: '',
      createOrderTime: '',
      sender: '',
      senderPhone: '',
      serviceConsultant: '',
      carBrand: '',
      carSeries: '',
      carType: '',
      vin: '',
      carCheckOutDate: '',
      repairType: '',
      predictedFinishTime: '',
      mileage: '',
      previousEntryTime: '',
      repairStation: '',
      suggestedNextMaintenanceTime: '',
      previousEntryMileage: '',
      suggestedNextMaintenanceMileage: ''
    });
  }

}
