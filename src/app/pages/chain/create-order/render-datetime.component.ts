import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';


@Component({
  template: `
    {{renderValue}}
    <input type="date" >
    sdfdfsdfsdfds
  `,
})
export class CustomRenderComponent implements ViewCell, OnInit {

  renderValue: string;

  @Input() value: string | number;

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }
}
