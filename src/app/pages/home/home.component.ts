import { Component, OnInit, ViewChild } from '@angular/core';
import { HqAlerter, TypeaheadRequestParams } from "app/shared/directives";
import { PagedResult } from 'app/shared/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  constructor() { }

  @ViewChild(HqAlerter)
  alerter: HqAlerter;

  showSelector: boolean;

  ngOnInit() {
    this.alerter.info('12345!', true, 0);
    this.alerter.error('12345!', true, 5000);
    setTimeout(() => this.alerter.success('12345!', true, 5000), 3000);
  }

  options = [{ text: 'text1', value: 'value1', selected: true }, { text: 'text2', value: 'value2', selected: true }, { text: 'text3', value: 'value3' }];

  onChange(item) {
    console.log(item);
  }

  onConfirm() {
    console.log('已确认');
  }

  public get typeaheadColumns() {
    return [
      { name: 'id', title: '编号' },
      { name: 'name', title: '姓名' },
      { name: 'gender', title: '性别' },
      { name: 'address', title: '住址', maxLength: 5 }
    ];
  }

  private typeaheadList = [
    { name: 'fisher', id: 1, gender: '男', address: '甘肃省陇南市西和县何坝镇十字路口' },
    { name: 'zhangsan', id: 1, gender: '女', address: '山西省大同市大同路18号' },
    { name: 'lisi', id: 1, gender: '女', address: '北京市海淀区八宝山A-1坑位' },
    { name: 'wangwu', id: 1, gender: '男', address: '北京市通州区通州北苑' },
    { name: 'zhaoliu', id: 1, gender: '女', address: '陕西省西安市长安街新华书店' },
    { name: 'qianqi', id: 1, gender: '男', address: '台湾省高雄市复兴路荣民街' },
    { name: 'wuba', id: 1, gender: '女', address: '黑龙江省黑河市' },
    { name: 'liujiu', id: 1, gender: '男', address: '云南省楚雄市冈泰傣族自治县遥寄村' },
    { name: 'fisher', id: 1, gender: '男', address: '甘肃省陇南市西和县何坝镇十字路口' },
    { name: 'zhangsan', id: 1, gender: '女', address: '山西省大同市大同路18号' },
    { name: 'lisi', id: 1, gender: '女', address: '北京市海淀区八宝山A-1坑位' },
    { name: 'wangwu', id: 1, gender: '男', address: '北京市通州区通州北苑' },
    { name: 'zhaoliu', id: 1, gender: '女', address: '陕西省西安市长安街新华书店' },
    { name: 'qianqi', id: 1, gender: '男', address: '台湾省高雄市复兴路荣民街' },
    { name: 'wuba', id: 1, gender: '女', address: '黑龙江省黑河市' },
    { name: 'liujiu', id: 1, gender: '男', address: '云南省楚雄市冈泰傣族自治县遥寄村' },
  ];

  public onTypeaheadSelect($event) {
    alert(JSON.stringify($event));
  }

  public get typeaheadSource() {
    return (params: TypeaheadRequestParams) => {
      let start = (params.pageIndex - 1) * params.pageSize;
      let end = params.pageSize + start;
      let data = this.typeaheadList.filter(m => m.name.includes(params.text)).slice(start, end);
      let total = this.typeaheadList.filter(m => m.name.includes(params.text)).length;
      return Promise.resolve(new PagedResult<any>(data, total, total));
    };
  }

  public selected: string;
  public states: string[] = ['Alabama', 'Alaska', 'Arizona', 'Arkansas',
    'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
    'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico',
    'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island',
    'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington',
    'West Virginia', 'Wisconsin', 'Wyoming'];
}
