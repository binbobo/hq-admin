import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Cell, DefaultEditor, Editor } from 'ng2-smart-table';

@Component({
  // 配置ngui-datetime-picker组件
  // 添加ngui-datetime-picker指令, valueChanged事件
  template: `
    <input [ngClass]="inputClass"
            ngui-datetime-picker
            readonly
            [(ngModel)]="cell.newValue"
            class="form-control datetime-editor"
            [name]="cell.getId()"
            [disabled]="!cell.isEditable()"
            [placeholder]="cell.getTitle()" >
  `,
  styleUrls: ['./create-order.component.css']
})
export class CustomDatetimeEditorComponent extends DefaultEditor {
  /**
   * 调用父类构造方法
   * @memberOf CustomEditorComponent
   */
  constructor() {
    super();
  }
}
