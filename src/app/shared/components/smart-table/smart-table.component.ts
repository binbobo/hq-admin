import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChange } from '@angular/core';


@Component({
  selector: 'smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.css']
})
export class SmartTableComponent implements OnInit, OnChanges {

  @Input() source: any;
  @Input() settings: Object = {};

  @Output() rowSelect = new EventEmitter<any>();
  @Output() userRowSelect = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() create = new EventEmitter<any>();
  @Output() deleteConfirm = new EventEmitter<any>();
  @Output() editConfirm = new EventEmitter<any>();
  @Output() createConfirm = new EventEmitter<any>();
  @Output() rowHover: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    let defaultSettings = Object.assign({}, SmartTableSetting);
    this.settings = Object.assign(defaultSettings, this.settings);
  }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    // if (changes['settings']) {
    //   Object.assign(this.settings, SmartTableSetting, changes['settings']);
    // }
  }

}
const SmartTableSetting = {
  noDataMessage: '没有数据',
  actions: {
    columnTitle: '操作',
    edit: false,   // 不显示编辑按钮
  },
  edit: {
    editButtonContent: '编辑',
    saveButtonContent: '更新',
    cancelButtonContent: '取消',
  },
  add: {
    addButtonContent: '添加',
    createButtonContent: '创建',
    cancelButtonContent: '取消',
    confirmCreate: true    // 添加确认事件必须配置项
  },
  delete: {
    confirmDelete: true,
    deleteButtonContent: '删除',
  }
}
