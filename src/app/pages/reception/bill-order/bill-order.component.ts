import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bill-order',
  templateUrl: './bill-order.component.html',
  styleUrls: ['./bill-order.component.css']
})

export class BillOrderComponent implements OnInit {
     // 详情数据
  public detailData:any= [{
                storeName: '总店', // 店名
                status: '维修中', // 状态
                type: '一般维修', // 维修类型
                orderNo: '313523532523', // 工单号
                enterTime: '2017-4-15 11:35:22', // 进店时间
                predictedTime: '2017-4-16 11:35:22', // 预计交车时间
                outeOfDate: '否', // 超时
                serviceConsultant: 'gaofei', // 服务顾问
                brand: '奥迪', // 品牌
                carType: '', // 车型
                plateNumber: '京A324P', // 车牌号
                mileage: '100公里', // 行驶里程
                buyTime: '2013-4-15', // 购车时间
                carOwner: 'xxx', // 车主
                sender: '凡凡', // 送修人
                senderPhoneNumber: '13699117904', // 送修人电话
                introducer: 'gaofei', // 介绍人
                introducerPhoneNumber: '13923421346', // 介绍人电话
                repairTechnician: '高飞', // 维修技师
                leaveFactoryTime: '2017-4-16 11:35:22' // 出厂时间
            },{
                storeName: '总店', // 店名
                status: '维修中', // 状态
                type: '一般维修', // 维修类型
                orderNo: '313523532523', // 工单号
                enterTime: '2017-4-15 11:35:22', // 进店时间
                predictedTime: '2017-4-16 11:35:22', // 预计交车时间
                outeOfDate: '否', // 超时(期)
                serviceConsultant: 'gaofei', // 服务顾问
                brand: '奥迪', // 品牌
                carType: '', // 车型
                plateNumber: '京A324P', // 车牌号
                mileage: '100公里', // 行驶里程
                buyTime: '2013-4-15', // 购车时间
                carOwner: 'xxx', // 车主
                sender: 'fanfan', // 送修人
                senderPhoneNumber: '13699117904', // 送修人电话
                introducer: 'gaofei', // 介绍人
                introducerPhoneNumber: '13923421346', // 介绍人电话
                repairTechnician: '', // 维修技师
                leaveFactoryTime: '2017-4-16 11:35:22' // 出厂时间
            }]

  // 维修项目
     public repairData=[{
                a: '项目名称1', // 项目名称
                b: '20', // 维修工时
                c: '200', // 工时单价
                d: '4000', // 金额
                e: '8折', // 折扣率
                f: '2017-4-16 11:35:22', //操作时间
                g:"gaofei"// 指派人
            },{
               a: '项目名称1', // 项目名称
                b: '20', // 维修工时
                c: '200', // 工时单价
                d: '4000', // 金额
                e: '8折', // 折扣率
                f: '2017-4-16 11:35:22', //操作时间
                g:""// 指派人
            }];

// 维修配件
     public repairPartsData=[{
                a: '项目1', // 维修项目
                b: '轮胎', // 配件名称
                c: '品牌1', // 品牌
                d: '型号1', // 规格型号
                e: '2个', // 数量
                f: '100', //单价（元）
                g: '200', // 金额（元）
                h: '2017-4-16 11:35:22', // 操作时间
            },{
                a: '项目1', // 维修项目
                b: '轮胎', // 配件名称
                c: '品牌1', // 品牌
                d: '型号1', // 规格型号
                e: '2个', // 数量
                f: '100', //单价（元）
                g: '200', // 金额（元）
                h: '2017-4-16 11:35:22', // 操作时间
            }];

// 附加项目
     public addPartsData=[{
                a: '项目名称1', // 项目名称
                b: '', // 
                c: '一般维修', // 
                d: '313523532523', // 
                e: '2017-4-15 11:35:22', // 
            },{
                a: '总店', // 
                b: '维修中', // 
                c: '一般维修', // 
                d: '313523532523', // 
                e: '2017-4-15 11:35:22', // 
            }];
// 建议维修项
     public addvicePartsData=[{
                a: '建议维修项目1', // 建议维修项目
                b: '否', // 是否修理
                c: '2017-4-15 11:35:22', // 操作时间
                d: '小明', // 操作员
                e: '2017-4-15 11:35:22', // 备注
            },{
                a: '建议维修项目1', // 建议维修项目
                b: '否', // 是否修理
                c: '2017-4-15 11:35:22', // 操作时间
                d: '小明', // 操作员
                e: '2017-4-15 11:35:22', // 备注
            }];
  constructor() {
   
   }

  ngOnInit() {
    
  }

}
