import { Component, OnInit } from '@angular/core';
import { FormControlErrorComponent } from '../form-control-error.component';

@Component({
  selector: 'hq-form-inline-control-error',
  templateUrl: './form-inline-control-error.component.html',
  styleUrls: ['./form-inline-control-error.component.css'],
  host: {
    '[class]': '"popover in popover-top top show"',
    role: 'tooltip',
    style: 'display:block;z-index:1'
  },
})
export class FormInlineControlErrorComponent extends FormControlErrorComponent implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
