import { Component,ViewChild,OnInit,Injector} from '@angular/core';
import { DataList } from '../../../shared/models/data-list';
import { OrderService, OrderListRequest, Order } from '../order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-append-order',
  templateUrl: './append-order.component.html',
  styleUrls: ['./append-order.component.css']
})

export class AppendOrderComponent extends DataList<Order> {
   createWorkSheetForm: FormGroup;
  // ng2-smart-table

  //维修项目表头
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
      } ,
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
      } ,
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
      } ,
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
      } ,
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
      isPriceQuoted : {
        title: '是否报价'
      } ,
      hasSuggestedItem: {
        title: '有无建议项目'
      }
    }
  };

  constructor(
    injector: Injector,
    protected service: OrderService,
    private fb: FormBuilder
  ) {
    super(injector, service);
    this.params = new OrderListRequest();

    // 构建表单
    this.createForm();
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
      repairStation:'',
      suggestedNextMaintenanceTime: '',
      previousEntryMileage: '',
      suggestedNextMaintenanceMileage: ''
    });
  }

}
