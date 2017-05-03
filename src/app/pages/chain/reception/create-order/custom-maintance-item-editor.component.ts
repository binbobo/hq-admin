import { Component, AfterViewInit } from '@angular/core';
import { Cell, DefaultEditor, Editor } from 'ng2-smart-table';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import { MaintenanceItem, OrderService } from '../order.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { StorageKeys } from 'app/shared/models';

@Component({
  template: `
    <input [ngClass]="inputClass"
            [(ngModel)]="asyncSelected"
            (blur) = "onBlur(maintanceItem)"
            (change) = "onChange()"
            #maintanceItem
            [typeahead]="dataSource"
            typeaheadOptionField="name"
            class="form-control form-control-sm"
            [name]="cell.getId()"
            [disabled]="!cell.isEditable()"
            [placeholder]="cell.getTitle()"
            (typeaheadOnSelect)="typeaheadOnSelect($event, maintanceItem)"
             >
  `,
  styleUrls: ['./create-order.component.css']
})
export class CustomMaintanceItemEditorComponent extends DefaultEditor {
  // 保存模糊查询的维修项目数据
  dataSource: Observable<MaintenanceItem>;
  asyncSelected: string;

  // 当前选择的维修项目id
  slectedMaintanceItemId = null;
  isSelected = false;

  // 是否从下拉列表中选择维修项目

  /**
   * 调用父类构造方法
   * @memberOf CustomEditorComponent
   */
  constructor(protected service: OrderService) {
    super();

    // 根据名称获取维修项目信息
    this.dataSource = Observable
      .create((observer: any) => {
        observer.next(this.asyncSelected);
      })
      .debounceTime(300)
      .distinctUntilChanged()
      .mergeMap((token: string) => this.service.getMaintenanceItemsByName(token));
  }

  onBlur(maintanceItem) {
    if (!this.slectedMaintanceItemId) {
      maintanceItem.value = '';
      this.slectedMaintanceItemId = null;
    }
    this.isSelected = false;
  }
  onChange() {
    if (!this.isSelected) {
      this.slectedMaintanceItemId = null;
    }
  }

  typeaheadOnSelect(evt: TypeaheadMatch) {
    // console.log(evt)
    this.cell.setValue(evt.value);
    // 保存维修项目Id
    sessionStorage.setItem(StorageKeys.MaintanceItemId, evt.item.id);

    this.slectedMaintanceItemId = evt.item.id;
    this.isSelected = true;
  }
}