import { Directive, ElementRef } from '@angular/core';
import { TrimDirective } from './trim.directive';
import { FormControlName } from '@angular/forms';

@Directive({
  selector: '[formControlName]'
})
export class FormControlNameTrimDirective extends TrimDirective {

  constructor(
    protected _el: ElementRef,
    private _controlName: FormControlName,
  ) {
    super(_el);
  }

  ngOnInit() {
    this._control = this._controlName.control;
    super.ngOnInit();
  }

}
