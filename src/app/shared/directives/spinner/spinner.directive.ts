import { OnChanges, Directive, ViewContainerRef, ComponentFactoryResolver, Input, SimpleChanges, OnInit } from '@angular/core';

@Directive({
  selector: '[hqSpinner]'
})
export class SpinnerDirective implements OnChanges, OnInit {

  @Input('hqSpinner')
  public loading: boolean;
  @Input()
  public size: number;
  private el: HTMLElement;
  private spinner: HTMLElement;
  private timer: any;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.el = this.viewContainerRef.element.nativeElement;
  }

  private init() {
    for (var index = 0; index < this.el.childElementCount; index++) {
      let element = this.el.children.item(index);
      element.classList.add('d-none');
    }
    if (this.el instanceof HTMLButtonElement) {
      this.el.disabled = true;
    }
    if (this.size) {
      this.spinner.style.fontSize = `${this.size}px`;
    }
    this.spinner.classList.remove('d-none');
    let rotate = 0;
    this.timer = setInterval(() => {
      rotate = (rotate + 10) % 360;
      this.spinner.style.transform = `rotate(${rotate}deg)`;
    }, 20);
  }

  private clear() {
    for (var index = 0; index < this.el.childElementCount; index++) {
      let element = this.el.children.item(index);
      element.classList.remove('d-none');
    }
    if (this.el instanceof HTMLButtonElement) {
      this.el.disabled = false;
    }
    clearInterval(this.timer);
    this.spinner.style.transform = 'none';
    this.spinner.classList.add('d-none');
    this.timer = null;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.spinner && 'loading' in changes) {
      if (changes['loading'].currentValue) {
        this.init();
      } else {
        this.clear();
      }
    }else{
      
    }
  }

  ngOnInit(): void {
    this.spinner = document.createElement('i');
    this.spinner.className = 'fa fa-spinner ml-1 d-none';
    this.el.appendChild(this.spinner);
  }

}
