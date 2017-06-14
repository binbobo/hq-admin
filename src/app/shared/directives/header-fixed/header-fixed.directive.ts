import { Directive, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[hqHeaderFixed]'
})
export class HeaderFixedDirective implements OnInit {

  private offsetTop: number;
  private fixed: boolean;
  private thead: HTMLElement;
  private container: HTMLElement;

  ngOnInit(): void {
    this.thead = this.el.nativeElement.querySelector('thead');
    this.container = this.el.nativeElement.parentElement;
    if (this.container) {
      this.offsetTop = this.container.getBoundingClientRect().top;
      this.container.addEventListener('scroll', (e) => {
        if (this.container.scrollTop > 0) {
          this.createCopyHeader();
        } else {
          this.cancel();
        }
      });
    }
  }

  private createCopyHeader() {
    if (!this.fixed) {
      let ths = Array.from(this.thead.querySelectorAll('th'));
      ths.forEach((th: HTMLTableHeaderCellElement) => {
        th.width = th.getBoundingClientRect().width + '';
      });
      let copy = this.thead.cloneNode(true) as HTMLElement;
      copy.classList.add('copy');
      this.thead.insertAdjacentElement('beforebegin', copy);
      this.thead.style.position = "absolute";
      ths.forEach((th: HTMLTableHeaderCellElement) => {
        th.style.display = "inline-block";
        th.style.borderRightWidth = "0";
      });
      this.thead.classList.add('fixed');
    }
    this.thead.style.top = (this.container.scrollTop - 0) + 'px';
    this.thead.style.whiteSpace = "nowrap";
    this.fixed = true;
  }

  private cancel() {
    this.el.nativeElement.querySelectorAll('thead').forEach((head: HTMLElement) => {
      if (head.classList.contains('fixed')) {
        head.classList.remove('fixed');
        head.removeAttribute('style');
        Array.from(this.thead.querySelectorAll('th')).forEach((th: HTMLTableHeaderCellElement) => {
          th.style.display = "table-cell";
        });
      } else {
        if (head.classList.contains('copy')) {
          head.remove();
        }
      }
    });
    this.fixed = false;
  }

  constructor(private el: ElementRef) {
  }
}
