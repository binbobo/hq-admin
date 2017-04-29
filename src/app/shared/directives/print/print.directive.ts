import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[hqPrint]',
  exportAs: 'hq-print',
})
export class PrintDirective {

  constructor(private el: ElementRef) { }

  public print() {
    let el = this.el.nativeElement as HTMLElement;
    let html = el.innerHTML;
    this.hideOthers();
    let div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div);
    window.print();
    div.remove();
    this.showOthers();
  }

  private hideOthers() {
    for (var index = 0; index < document.body.childElementCount; index++) {
      let element = document.body.children.item(index);
      element.classList.add('d-none');
    }
  }

  private showOthers() {
    for (var index = 0; index < document.body.childElementCount; index++) {
      let element = document.body.children.item(index);
      element.classList.remove('d-none');
    }
  }
}
