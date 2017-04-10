import { Component, OnInit, Input, Host } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'control-error',
  templateUrl: './control-error.component.html',
  styleUrls: ['./control-error.component.css']
})
export class ControlErrorComponent implements OnInit {

  @Input()
  public code: string;
  public visible: boolean;

  constructor(

  ) { }

  ngOnInit() {
  }
}
