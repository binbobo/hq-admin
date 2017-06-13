import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'hq-workshop-search-form',
  templateUrl: './workshop-search-form.component.html',
  styleUrls: ['./workshop-search-form.component.css']
})
export class WorkshopSearchFormComponent implements OnInit {
  @Input()
  types: any; // 工单类型
  @Input()
  statistics: any; // 不同状态下的工单个数统计对象

  // 搜索关键字
  keyword: string = '';

  @Output() formSubmit = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onFormSubmit() {
    // 获取当前选中的状态id列表

    let checkedStatus = this.types.filter(item => item.checked);
    // 没选的话   查询所有
    if (checkedStatus.length === 0) {
      checkedStatus = this.types;
    }
    this.formSubmit.emit({
      chechedStatusIds: checkedStatus.filter(item => item.id !== 'all').map(item => item.id),
      keyword: this.keyword
    });
  }

  /**
   * 状态改变事件处理程序
   * @param type
   */
  onStatusChange(type) {
    type.checked = !type.checked;

    if (type.id === 'all') {
      this.types.map(item => item.checked = type.checked);
    } else {
      if (!type.checked) {
        this.types[0].checked = false;
      } else {
        const len = this.types.filter(item => item !== type && item.id !== 'all' && item.checked).length;
        if (len === this.types.length - 2) {
          this.types[0].checked = true;
        }
      }
    }
    // 刷新页面
    this.onFormSubmit();
  }

}
