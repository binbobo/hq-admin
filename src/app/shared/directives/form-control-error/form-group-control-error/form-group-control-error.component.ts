import { Component, OnInit } from '@angular/core';
import { FormControlErrorComponent } from '../form-control-error.component';

@Component({
  selector: 'hq-form-group-control-error',
  templateUrl: './form-group-control-error.component.html',
  styleUrls: ['./form-group-control-error.component.css']
})
export class FormGroupControlErrorComponent extends FormControlErrorComponent implements OnInit {

  constructor() { super() }

  ngOnInit() {
  }
}
