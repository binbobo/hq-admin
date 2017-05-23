import { Directive, Input, ElementRef, Injector } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';
import { TrimDirective } from './trim.directive';

@Directive({
  selector: '[ngModel]'
})
export class NgModelTrimDirective extends TrimDirective {

  constructor(
    protected _el: ElementRef,
    protected _model: NgModel,
  ) {
    super(_el);
  }

  ngOnInit() {
    this._control = this._model.control;
    super.ngOnInit();
  }

}