import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: 'input,textarea,[hqTrim]'
})
export class TrimDirective {

  constructor(private el: ElementRef) { }

  ngOnInit() {
    let element = this.el.nativeElement;
    if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement && element.type === 'text') {
      element.addEventListener('input', (event) => {
        let target: any = event.target as HTMLElement;
        let start = target.selectionStart;
        let end = target.selectionEnd;
        if (!target.value) return;
        let trimValue = target.value.trim();
        if (target.value === trimValue) return;
        let index = target.value.indexOf(trimValue);
        target.value = trimValue;
        target.selectionStart = start - index;
        target.selectionEnd = target.selectionStart;
      });
    }
  }

}
