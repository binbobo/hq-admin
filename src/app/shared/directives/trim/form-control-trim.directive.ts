import { Directive, Input, ElementRef, Injector } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';
import { TrimDirective } from './trim.directive';

@Directive({
  selector: '[formControl]'
})
export abstract class FormControlTrimDirective extends TrimDirective {

  constructor(
    protected _el: ElementRef,
    protected _control: FormControl,
  ) {
    super(_el);
  }

  ngOnInit() {
    this._control = this._control;
    super.ngOnInit();
  }

}
