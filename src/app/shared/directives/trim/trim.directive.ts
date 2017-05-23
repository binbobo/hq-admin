import { Directive, Input, ElementRef, Injector } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';

export abstract class TrimDirective {

  protected _control: FormControl;

  constructor(
    protected _el: ElementRef,
  ) { }

  protected trim() {
    let target: any = this._el.nativeElement as HTMLElement;
    let start = target.selectionStart;
    let end = target.selectionEnd;
    if (!target.value) return;
    let trimValue = target.value.trim();
    if (target.value === trimValue) return;
    let index = target.value.indexOf(trimValue);
    this._control.setValue(trimValue);
    target.selectionStart = start - index;
    target.selectionEnd = target.selectionStart;
  }

  ngOnInit() {
    this._control.valueChanges.subscribe(() => this.trim());
  }

}
