import { Directive, ElementRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { PrintComponent } from './print.component';

@Directive({
  selector: '[hqPrint]',
  exportAs: 'hq-print',
})
export class PrintDirective {

  constructor(
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  public print() {
    let el = this.el.nativeElement as HTMLElement;
    let copy = el.cloneNode(true) as HTMLElement;
    copy.classList.add('hq-visible');
    copy.style.display = 'contents';
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(PrintComponent);
    let componentRef = this.viewContainerRef.createComponent(componentFactory);
    let hiddenItems = copy.querySelectorAll('.print-visible');
    Array.from(hiddenItems).forEach(dom => dom.classList.remove('print-visible'));
    componentRef.instance.html = copy.outerHTML;
    this.hideOthers();
    document.body.insertAdjacentElement('afterbegin', componentRef.location.nativeElement);
    setTimeout(() => {
      window.print();
      this.showOthers();
      componentRef.location.nativeElement.remove();
      copy = null;
    }, 100);

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
