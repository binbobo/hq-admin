import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[hqConversionCase]'
})
export class ConversionCaseDirective {

  @Input('hqConversionCase') hqConversionCaseVal: string;
  @HostListener('input', ['$event']) oninput(ev) {
    if (this.hqConversionCaseVal === "upper") {
      ev.target.value = ev.target.value.toUpperCase();
    }
    if (this.hqConversionCaseVal === "lower") {
      ev.target.value = ev.target.value.toLowerCase();
    }
  }

  constructor(
  ) {
  }
}
