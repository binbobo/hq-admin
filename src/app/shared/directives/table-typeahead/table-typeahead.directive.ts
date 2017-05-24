import { Directive, ViewContainerRef, ComponentFactoryResolver, Input, EventEmitter, Output, OnInit, HostListener, ElementRef, Component, ComponentRef, Injector, TemplateRef } from '@angular/core';
import { TableTypeaheadComponent } from './table-typeahead.component';
import { PagedResult, PagedParams } from 'app/shared/models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
@Directive({
  selector: '[hqTableTypeahead]',
  exportAs: 'hq-table-typeahead'
})
export class TableTypeaheadDirective implements OnInit {
  @Input("hqTableTypeahead")
  protected source: (params: TypeaheadRequestParams) => Promise<PagedResult<any>>;
  @Input()
  protected delay: number = 600;
  @Input()
  protected forceRefresh: boolean;
  @Input()
  protected columns: Array<TableTypeaheadColumn>;
  @Input()
  protected pageSize: number = 10;
  @Input()
  protected multiple: boolean;
  @Input()
  protected showTitle = true;
  @Input()
  protected checkStrategy: (item: any) => boolean;
  @Input()
  protected params: Object;
  @Output()
  protected onSelect = new EventEmitter<any>();
  private el: HTMLInputElement;
  private componentRef: ComponentRef<TableTypeaheadComponent>;
  private paging = false;
  private sortedKeys: Array<string> = [];
  private statusElement: HTMLElement;
  private disabled = false;
  constructor(
    protected viewContainerRef: ViewContainerRef,
    protected componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.el = this.viewContainerRef.element.nativeElement;
  }
  @HostListener('blur', ['$event'])
  onBlur(event) {
    if (!this.multiple) {
      setTimeout(() => {
        if (this.paging) {
          this.el.focus();
          this.paging = false;
        } else {
          this.hide();
        }
      }, 200);
    }
  }
  @HostListener('focus', ['$event'])
  onFocus(event) {
    if (!this.paging && event.sourceCapabilities) {
      this.search();
    }
  }
  @HostListener('input', ['$event'])
  onInput(event) {
    this.componentRef.instance.result = null;
  }
  show() {
    let rect = this.el.getBoundingClientRect();
    this.componentRef.instance.minWidth = rect.width;
    this.componentRef.instance.show();
  }
  hide() {
    this.componentRef.instance.hide();
  }
  private search(pageIndex = 1) {
    if (this.disabled) return;
    if (!this.paging) {
      this.componentRef.instance.result = null;
    }
    let param = new TypeaheadRequestParams(this.el.value);
    param.setPage(pageIndex, this.pageSize);
    this.statusElement.classList.add('fa-spinner');
    let rotate = 0;
    let animation = setInterval(() => {
      rotate = (rotate + 10) % 360;
      this.statusElement.style.transform = `rotate(${rotate}deg)`;
    }, 20);
    let stopAnimation = () => {
      clearInterval(animation);
      this.statusElement.classList.remove('fa-spinner');
      this.statusElement.style.transform = 'none';
    };
    if (this.source) {
      this.source(param)
        .then(result => result || new PagedResult())
        .then(result => {
          if (this.multiple && this.checkStrategy) {
            result.data.forEach(m => {
              m.checked = this.checkStrategy(m);
              console.log(m.checked);
            });
          }
          this.componentRef.instance.result = result;
          this.show();
        })
        .then(() => stopAnimation())
        .catch(err => {
          console.log(err);
          stopAnimation();
          this.componentRef.instance.result = null;
        });
    }
  }
  ngOnInit(): void {
    if (this.columns) {
      this.sortedKeys = this.columns
        .slice(0)
        .sort((m, n) => {
          m.weight = m.weight || 0;
          n.weight = n.weight || 0;
          return m.weight === n.weight ? 0 : n.weight - m.weight
        })
        .map(m => m.name);
    }
    let wrapper = document.createElement("div");
    this.el.insertAdjacentElement('beforebegin', wrapper);
    wrapper.className = 'input-group';
    wrapper.appendChild(this.el);
    let span = document.createElement('span');
    span.className = "input-group-addon";
    this.statusElement = document.createElement('i');
    this.statusElement.className = "cursor-pointer fa fa-search";
    span.appendChild(this.statusElement);
    wrapper.appendChild(span);
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(TableTypeaheadComponent);
    this.componentRef = this.viewContainerRef.createComponent(componentFactory);
    let ne = this.componentRef.location.nativeElement;
    wrapper.insertAdjacentElement('afterend', ne);
    if (this.showTitle) {
      if (!this.columns || this.columns.length < 2) {
        this.showTitle = false;
      }
    }
    let component = this.componentRef.instance;
    component.columns = this.columns;
    component.size = this.pageSize;
    component.multiple = this.multiple;
    component.showTitle = this.showTitle;
    component.onPageChange.subscribe(params => {
      this.paging = true;
      this.search(params.pageIndex);
    });
    component.onSelect.subscribe((item) => {
      let originValue = this.el.value;
      if (!this.multiple) {
        let selectedValue = this.sortedKeys
          .filter(key => item[key])
          .map(key => item[key].toString())
          .find(value => value.includes(originValue));
        if (selectedValue) {
          this.disabled = true;
          this.el.value = selectedValue.trim();
          let event = new Event('input');
          this.el.dispatchEvent(event);
          this.el.focus();
          setTimeout(() => {
            this.paging = false;
            this.disabled = false;
          }, this.delay + 100);
        }
      }
      this.onSelect.emit(item);
    })
    Observable.fromEvent(this.el, 'input')
      .map((e: any) => e.target.value)
      .debounceTime(this.delay)
      .subscribe(value => {
        this.hide();
        this.search();
      });
    this.statusElement.addEventListener('click', (event: MouseEvent) => {
      event.stopPropagation();
      if (this.el.disabled || this.el.readOnly) return false;
      let el = event.target as HTMLElement;
      if (!el.classList.contains('fa-spinner')) {
        this.search();
      }
    });
  }
}
export class TableTypeaheadColumn {
  constructor(
    public name: string,
    public weight: number = 0,
    public title?: string,
    public maxLength?: number,
  ) { }
}
export class TypeaheadRequestParams extends PagedParams {
  constructor(public text?: string) {
    super();
  }
}
