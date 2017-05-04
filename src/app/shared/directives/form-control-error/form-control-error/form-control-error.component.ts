import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hq-form-control-error',
  templateUrl: './form-control-error.component.html',
  styleUrls: ['./form-control-error.component.css']
})
export class FormControlErrorComponent implements OnInit {

  @Input()
  public errors: Array<string>;

  constructor() { }

  ngOnInit() {
  }

}
