import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[hqPrint]',
  exportAs: 'hq-print',
})
export class PrintDirective {

  constructor(private el: ElementRef) { }

  public print() {
    let el = this.el.nativeElement as HTMLElement;
    let copy = el.cloneNode(true) as HTMLElement;
    copy.classList.add('hq-visible');
    copy.style.display = 'contents';
    this.hideOthers();
    let container = document.createElement("div");
    container.id = 'hq-printing';
    container.appendChild(copy);
    document.body.appendChild(container);
    window.print();
    container.remove();
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
