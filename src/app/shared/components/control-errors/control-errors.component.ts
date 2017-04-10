import { Component, OnInit, OnDestroy, Input, QueryList, ContentChildren, AfterContentInit } from '@angular/core';
import { ControlErrorComponent } from './control-error/control-error.component';
import { FormGroup } from '@angular/forms';
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'control-errors',
  templateUrl: './control-errors.component.html',
  styleUrls: ['./control-errors.component.css']
})
export class ControlErrorsComponent implements OnInit, OnDestroy, AfterContentInit {

  @Input()
  private control: string;
  @Input()
  private form: FormGroup;
  @ContentChildren(ControlErrorComponent)
  private errors: QueryList<ControlErrorComponent>;
  private valueChange: Subscription;

  constructor() { }

  ngOnInit() {

  }

  ngOnDestroy(): void {
    if (this.valueChange) {
      this.valueChange.unsubscribe();
    }
  }

  ngAfterContentInit() {
    if (!this.form || !this.form.controls) return;
    this.valueChange = this.form
      .valueChanges
      .subscribe(data => {
        let control = this.form.controls[this.control];
        this.errors.forEach(m => {
          m.visible = control && (control.dirty || control.touched) && control.invalid && control.hasError(m.code);
        })
      });
  }
}
