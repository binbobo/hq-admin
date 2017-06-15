import { Directive, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Directive({
  selector: '[hqHeaderFixed]'
})
export class HeaderFixedDirective implements OnInit, OnDestroy {

  private fixed: boolean;
  private thead: HTMLElement;
  private container: HTMLElement;
  private observer: MutationObserver;

  private fix() {
    if (!this.fixed) {
      let copy = this.thead.cloneNode(true) as HTMLElement;
      copy.classList.add('copy');
      this.thead.insertAdjacentElement('beforebegin', copy);
      let headers = Array.from(this.thead.querySelectorAll('th'));
      headers.forEach((th: HTMLTableHeaderCellElement) => {
        th.width = th.getBoundingClientRect().width + '';
      });
      headers.forEach((th: HTMLTableHeaderCellElement) => {
        th.style.display = "inline-block";
        th.style.borderRightWidth = "0";
      });
      this.thead.style.position = "absolute";
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
    this.observer = new MutationObserver((mutations) => {
      if (this.fixed) {
        this.container.scrollTop = 0;
        this.cancel();
      }
    });
  }

  ngOnInit(): void {
    let el = this.el.nativeElement as HTMLElement;
    let tbody = el.querySelector('tbody');
    if (!tbody) {
      console.warn('table中没有包含tbody,无法使用hqHeaderFixed指令');
      return;
    }
    let config = { childList: true };
    this.observer.observe(tbody, config);
    this.thead = el.querySelector('thead');
    if (!this.thead) {
      console.warn('table中没有包含thead,无法使用hqHeaderFixed指令');
      return;
    }
    this.container = el.parentElement;
    if (this.container) {
      this.container.addEventListener('scroll', (e) => {
        if (this.container.scrollTop > 0) {
          this.fix();
        } else {
          this.cancel();
        }
      });
    }
  }
  
  ngOnDestroy(): void {
    this.observer && this.observer.disconnect();
  }
}
