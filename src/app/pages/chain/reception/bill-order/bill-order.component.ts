import { Component, OnInit, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataList, StorageKeys } from "app/shared/models";
import { BillOrderService, OrderListSearch } from "./bill-order.service";

@Component({
    selector: 'app-bill-order',
    templateUrl: './bill-order.component.html',
    styleUrls: ['./bill-order.component.css']
})

export class BillOrderComponent extends DataList<any>{
    billId: any;
    statekey: any[];
    orderStatusData: any;
    selectedOrder = null;
    workSheetSearchForm: FormGroup;
    params: OrderListSearch;
    public user = null;
    constructor(injector: Injector,
        protected service: BillOrderService,
        private fb: FormBuilder) {
        super(injector, service);
        this.params = new OrderListSearch();
        // 状态
        this.service.getOrderStatus()
            .subscribe(data => {
                this.orderStatusData = data;
            });
        this.user = JSON.parse(sessionStorage.getItem(StorageKeys.Identity));
        // 构建表单
        this.createForm();
        this.onLoadList();
    }


    ngOnInit() {

    }
    onSearch() {
        // 组织工单状态数据
        const checkedStatus = this.orderStatusData.filter(item => {
            return item.checked;
        });
        this.params.statekey = checkedStatus.map(item => item.key);

        // 执行查询
        this.onLoadList();
    }

    orderDetailsDialog(evt, id, dialog) {
        evt.preventDefault();
        // 显示窗口
        dialog.show();
        // 根据id获取工单详细信息
        this.service.get(id).then(data => {
            console.log('根据工单id获取工单详情数据：', data);

            // 记录当前操作的工单记录
            this.selectedOrder = data;
            this.billId = this.selectedOrder["id"]
            // 统计各项费用

            // 工时费： 维修项目金额总和
            this.selectedOrder.workHourFee = data.serviceOutputs.reduce((accumulator, currentValue) => {
                return accumulator += (currentValue.amount);
            }, 0);
            // 材料费： 维修配件金额总和
            this.selectedOrder.materialFee = data.productOutputs.reduce((accumulator, currentValue) => {
                return accumulator += (currentValue.count * currentValue.price);
            }, 0);
            // 其它费： 0
            this.selectedOrder.otherFee = 0;
            // 总计费： 
            this.selectedOrder.sumFee = this.selectedOrder.workHourFee + this.selectedOrder.materialFee + this.selectedOrder.otherFee;
            this.billPrice = this.selectedOrder.sumFee;
        });
    }
    private billData = {};
    private billPrice;
    // 点击确定生成结算单
    BillClick(evt, dialog) {
        evt.preventDefault();
        dialog.hide();
        this.billData["id"] = this.billId;
        this.billData["price"] = this.billPrice;
        console.log(this.billData);
        this.service.post(this.billPrice, this.billId).then(() => {
            console.log('生成结算单成功');
        }).catch(err => console.log("添加维修项目失败" + err));
    }
    update(value: string) { this.billPrice = value; }
    createForm() {
        // 初始化数组类型参数
        this.statekey = []
        this.workSheetSearchForm = this.fb.group({
            carnumber: '', // 车牌号
            billcode: '',//工单号
            starttime: '',
            endtime: '',
        });
    }
}
