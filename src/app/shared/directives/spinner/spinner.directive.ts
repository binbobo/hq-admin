import { OnChanges, Directive, ViewContainerRef, ComponentFactoryResolver, Input, SimpleChanges, OnInit } from '@angular/core';

@Directive({
  selector: '[hqSpinner]',
  exportAs: 'hq-spinner'
})
export class SpinnerDirective implements OnChanges, OnInit {

  @Input('hqSpinner')
  public loading: boolean;
  @Input()
  public size: number;
  private el: HTMLElement;
  private spinner: HTMLElement;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.el = this.viewContainerRef.element.nativeElement;
  }

  private init() {
    if (this.el instanceof HTMLButtonElement) {
      this.el.classList.add('disabled');
    }
    this.spinner.classList.remove('d-none');
  }

  private get sizeClass() {
    if (!this.size) {
      return 'fa-none-size';
    } else if (this.size === 1) {
      return 'fa-lg';
    } else if (this.size > 0 && this.size < 5) {
      return `fa-${this.size}x`;
    } else {
      return 'fa-5x';
    }
  }

  private clear() {
    if (this.el instanceof HTMLButtonElement) {
      this.el.classList.remove('disabled');
    }
    this.spinner.classList.add('d-none');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.spinner && 'loading' in changes) {
      if (changes['loading'].currentValue) {
        this.init();
      } else {
        this.clear();
      }
    }
  }

  ngOnInit(): void {
    this.spinner = document.createElement('i');
    this.spinner.className = 'fa fa-spinner fa-fw fa-spin';
    this.spinner.classList.add(this.sizeClass);
    this.el.insertAdjacentElement('afterbegin', this.spinner);
    this.loading || this.clear();
  }

}
